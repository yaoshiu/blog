---
title: Fuck Plan 9
description: none, fuck it
published: 2025-11-30
tags:
  - Thoughts
---

> *All of us who do creative work, we get into it because we have good taste. But there is this gap. For the first couple years you make stuff, it’s just not that good. It’s trying to be good, it has potential, but it’s not.*
>
> *But your taste, the thing that got you into the game, is still killer. And your taste is why your work disappoints you. A lot of people never get past this phase, they quit.*
>
> -- Ira Glass

I've been dreaming about making something big. I saw myself in Steve Jobs, I wanted the philosophy of Unix and Plan 9, that "do one thing and do it well" shit and I was dying for it. Eager to bring back the "Jobs-era Apple taste."

But I knew my limits, I was the one who thought a lot but did little. I kept finding myself `mkdir`-ing a directory, entering it, saying that "I'm gonna make something big" and spacing out, just brainstorming the directory hierarchy hundreds of times. And everytime I wrote my first lines of code I would say "No, this is not elegant" and just `:q!`-ed it.

While the Meta team was making PyTorch in C++ I was talking about "C++ is crap" and seeking for "the real elegant language", walking through all Rust and Scheme and Haskell and shit, "Rust isn't pure enough, but GC is evil", and I would think "Systemd/GNU/Linux is too hacky, I want a non-GNU Linux, or just go BSD, and even Plan 9! I would port Nix to it! But not on x86, there are too many instruction-set quirks, we need RISC-V!", I was saying "No, I don't make a Lisp interpreter or a Kaleidoscope compiler from a tutorial, making things without understanding it is dumb, I need to go through those MIT/BSD OCWs, to read the Dragon Book, I should even 'reboot' my CS career starting from CS61A, because the Chinese way of teaching ruined my mind. I would start when I was ready!" But I was never ready, just like a snob, judging things to sound "sophisticated" but I never made anything.

But, is Steve Jobs really that "elegant"? When he made the world's first Apple computer, Wozniak hacked all that shit together to make it. I would bet my name that the prototype was nothing near "elegant", and more likely just a mess of code and chips and cables. Is everything made by Steve Jobs "elegant"? No, Objective-C was never "elegant", it's just glue to make C "Objective", so if I, from the past, were to comment on Objective-C, I would say: "It's combining two horrible things into a giant crap!". Jobs was a critic, but he's a critic on the user experience side, not the tech side.

The success of Unix is exactly the success of "inelegance". Richard P.Gabriel once wrote a famous article *Worse is Better*: if we stick to the "elegant" side, we are sticking to the MIT/Lisp side. We put correctness, consistency and integrity above everything else. If anything ever happened to be wrong we would rather not do it than do it in an "inelegant" way. That's why Lisp Machine died. The other side is the New Jersey side, which is precisely where Unix lives. They would say that implementation simplicity is of the highest importance, for that sake correctness can be sacrificed. And the result is that C and Unix now rule the world, and Lisps are almost only for nerds like me.

Reading those books, finishing those courses and learning those theories is a form of escape. I was escaping from admitting that I wrote crap, thinking that if I stuck to learning I never failed, and I would forever be "brilliant".

And this went on even when I was about to finish college and find a job, I didn't post a résumé because I was thinking "I need a Rust job, I hate C++", so I didn't get a job until I graduated and I finally surrendered, I said "Fine, C++. Just not Java, anything but JVM", so I applied for this job I'm now working at, and I was worried that I hadn't finished the *Effective Modern C++*, so I would occasionally write C + STL style code and that sucks. But when I entered this company I realised that real engineers don't read the EMC++. When I was interviewed, I was talking about a C++20 async runtime implementation of my own and my interviewer was so confused because he hadn't written a single line of code compiled with `-std=c++20`. My team works on a build system that relies on Bash, Python Scripts without virtual environments, Ubuntu APT, and all the projects should be placed correctly under the build system project root so that they can generate a Makefile (by a Bash script, hard coded as `#!/usr/bin/bash` instead of `#!/usr/bin/env bash`), `clangd` fails to find references here so you end up using `rg (?:\.|->)\s*foo`, the search feature provided by VSCode or the more old school, `grep -r`. Most of my team members don't recognise all C++14 features. But all this shit didn't stop them from building the best RTC network in the world.

And the reason why I didn't post anything after I built this blog site was that every time I was about to write something and I would think: "If another ‘me’ were reading my post, would he find it banal?" and everytime I got a "yes" so I gave up. But now I would say to the very "another me": "Fuck you! I'm going to write anything I want and it's not up to you who wrote nothing out to judge me.". So there's this post. 

Fuck Plan 9, fuck my super-ego.

> *Real artists ship* -- Steve Jobs
