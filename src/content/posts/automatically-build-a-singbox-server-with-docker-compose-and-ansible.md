---
title: Build a Sing Box Server with Ansible and Docker Compose
description: This article briefly documents the process of deploying a sing-box server on a VPS using Ansible and Docker Compose, with automated subscription management implemented through Serenity.
published: 2025-02-05
tags:
  - Automation
  - Docker
  - Ansible
  - Proxy
  - sing-box
---

I now use ChatGPT virtually everywhere, and it has almost entirely replaced search engines in my workflow. However, I rencently noticed that ChatGPT occasionally "acts less intelligent" - for example, suddenly losing web browsing capabilities or providing significantly lower-quality responses. After some quick research, I discovered that OpenAI has added new restrictions: if a session request comes from an IP address deemed insufficiently "clean," it silently switches to a less capable model. This renders commercial VPS services unusable, as fiding a node with a sufficiently "clean" IP on such platforms is nearly impossible. Self-hosting a private proxy/VPS now seems like the only viable solution.

For machine selection, ZgoCloud's ([AFF link here](https://clients.zgovps.com/?affid=1008)) Osaka AMD Performances instance suits my need well. While its IP reputation isn't as pristine as their Los Angles instances (which use residential IPs compared to Osaka's broadcast IPs), the streaming-unblocking capabilities remain remarkably robust. The impressively low latency between Japanese servers and mainland China even allows me to repurpose it for additional uses, such as serving as a RustDesk relay server in certain remote access scenarios.

On the technical front, while I remain a dedicated NixOS advocate, the stark reality is that few providers offer native NixOS installations The prospect of manually SSH-ing into every new machine to deploy via `nixos-infect` script during each migration proved too burdensome. This led me to compromise with Docker Compose as my deployment strategy. Yet even this alternative requires tedious manual configurations - from Docker installation to BBR optimization and TCP Fast Open tuning - which ultimately drove me to implement Ansible for orchestrating these repetitive tasks through automated playbooks.

First, let's define the Ansible inventory. I actually have another Los Angeles-based instance leased from BageVM ([AFF link here](https://www.bagevm.com/aff.php?aff=369)), though its unoptimized network routes result in subpar performance. In terms of service accessibility, this machine only reliably prevents ChatGPT's "model degradation" on mobile clients, while web browser access still frequently encounters intelligence downgrades (but at $2.6/month for 4TB bandwidth, expectations should remain modest). Nevertheless, since it's already provisioned, I'll include it in the configuration to avoid resource waste. These two instances can share identical configurations, requiring only differentiation through the country_flag variable. The main variable serves to accelerate deployment workflows - since the BageVM instance doesn't require Serenity subscription link generation (adequately handled by the ZgoCloud node), we can safely bypass that process.

```yaml
vps:
  hosts:
    bagevm.fayash.me:
      country_flag: 🇺🇸
    zgo-osaka.fayash.me:
      main: true
      country_flag: 🇯🇵
```


Next comes the playbook configuration. For Docker installation, we must use the official CE version rather than Debian's `docker.io` and `docker-compose` packages. The `docker-compose` from Debian's repositories is essentially a wrapper script around Docker rather than a proper plugin, making it incompatible with Ansible's `community.docker.docker_compose_v2` module. Considering this VPS might serve multiple purposes, we'll implement Caddy both as a reverse proxy server and for automated SSL certificate management through its native ACME integration.

Given the requirement to host the entire project on GitHub, all proxy-related cryptographic keys must be secured through Ansible Vault encryption. This necessitates creating a dedicated `vars/secrets.yml` file following Ansible's security best practices.

The `docker-compose.yml` file requires templating to accommodate functional differences across VPS instances with distinct roles.

```yaml
- name: Deploy
  hosts: vps
  become: true
  vars_files:
    - vars/secrets.yml

  tasks:
    - name: Install Docker
      block: 
        - name: Install prequisites
          apt:
            name:
              - ca-certificates
              - curl
              - gpg
            state: present
            update_cache: true

        - name: Add Docker GPG key
          apt_key:
            url: https://download.docker.com/linux/debian/gpg
            state: present

        - name: Add Docker repository
          apt_repository:
            repo: "deb [arch=amd64] https://download.docker.com/linux/debian {{ ansible_distribution_release }} stable"
            state: present

        - name: Install Docker
          apt:
            name: 
              - docker-ce
              - docker-ce-cli
              - containerd.io
              - docker-buildx-plugin
              - docker-compose-plugin
            state: present
            update_cache: true

    - name: Enable BBR
      block:
        - name: Load tcp_bbr module
          modprobe:
            name: tcp_bbr
            persistent: present

        - name: Enable BBR
          sysctl:
            name: "{{ item.name }}"
            value: "{{ item.value }}"
            state: present
          loop:
            - name: net.core.default_qdisc
              value: fq
            - name: net.ipv4.tcp_congestion_control
              value: bbr

    - name: Enable TFO
      sysctl:
        name: net.ipv4.tcp_fastopen
        value: 3
        state: present
        reload: true

    - name: Upload files
      block:
        - name: Install rsync
          apt:
            name: rsync
            state: present
            update_cache: true

        - name: Upload files
          synchronize:
            src: ./docker-compose/
            dest: /opt/docker-compose/
            rsync_opts:
              - "--compress"
              - "--delete"

    - name: Templating
      template:
        src: "{{ item.src }}"
        dest: "{{ item.dest }}"
      loop:
        - name: Generate docker-compose
          src: templates/docker-compose.yml.j2
          dest: /opt/docker-compose/docker-compose.yml
        - name: Generate Caddyfile
          src: templates/Caddyfile.j2
          dest: /opt/docker-compose/caddy/Caddyfile
        - name: Generate sing-box config
          src: templates/sing-box.json.j2
          dest: /opt/docker-compose/sing-box/config.json
      loop_control:
        label: "{{ item.name }}"

    - name: Generate serenity config
      template:
        src: templates/serenity-per-user.json.j2
        dest: /opt/docker-compose/serenity/{{ item.name }}.json
      loop: "{{ users }}"
      loop_control:
        label: "{{ item.name }}"
      when: main | default(false)

    - name: Start Docker Compose
      community.docker.docker_compose_v2:
        project_src: /opt/docker-compose/
        recreate: always
        remove_orphans: true
```

This is the core configuration workflow. The remaining files are intentionally straghtforward, with the entire project repository hosted on [GithUb](https://github.com/yaoshiu/vps-ansible). You can easily adapt it to your environment by simply modifying `var_files/secrets.yml` and `inventory.yml`.
