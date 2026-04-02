---
title: How I Accidentally Reinvented Kernel
description: An exploration of building a minimalist Fexpr-based Lisp interpreter in Haskell.
published: 2026-04-02
tags:
  - Haskell
  - Lisp
  - WASM
---

## Context

I've been interested in Haskell for quite a long time, but didn't manage to write a single line of code. I've been reading *LYAH([Lear You a Haskell for Great Good!](https://learnyouahaskell.github.io/))* for almost a year and got stuck before the Monad chapter. Back then every single section in LYAH seemed so complex for me that I needed hours to understand it. Actually I've restarted the book about twice or three times.

And there goes the opening.

So I started this project, since a Lisp interpreter is something that can't go wrong when you're learning a programming language, and Haskell is well-suited for it.

If you'd like to try it first, here's a [live REPL](https://yaoshiu.github.io/opus):

<iframe src="https://yaoshiu.github.io/opus" width="100%" height=500 loading="lazy"></iframe>

## How I Moved Away from Scheme

The initial target of this project was to make something much like Scheme, after all it's the "industrial standard" of Lisps, and this project was started as a practice, so Scheme was the perfect target at first.

It all started quite well. Writing a parser for Lisp in Haskell was smooth. The evaluator with special forms, although felt verbose, was something I'd expected for an "interpreter".

I started struggling when I got to `begin`. Scheme has a very complex definition for `begin` and function body. `begin` behaves differently when it's in top-level, beginning of a function body, and an expression, because Scheme treats "statements" and "expressions" differently where a `define` statement isn't an expression. So `begin` is context-sensitive, and we would need some other state in our interpreter for it to know the context.

This just felt unacceptable for me, that I would need to create a special form that's even more "special" than others. And the way Scheme distinguishes "statements" and "expressions" was also somewhat unsettling to me. So I made my switch. I gave up creating something similar to Scheme, instead I started exploring something more minimal.

The first change I made was to eliminate the "statement" concept, making the language a purely expression-based language could make my later steps easier, since we wouldn't have to think about how other components would behave when they were in different contexts. There were options for the `define` expression, which is to return the defined value or to return an empty value. For the sake of not writing something like `(define b (define a b))` I chose the latter. Eliminating the "statement" concept allowed me to make `begin` a very simple expression just for sequential execution.

## TCO / Monad Stack / ContT

After parting ways with Scheme by making `define` from a statement to an expression, I completed a "functional core" for this language, with a static environment and a special form `lambda` to define functions. By the time this interpreter was still a direct-style interpreter. My monad stack looked like this:

```haskell
newtype Eval a = Eval { unEval :: StateT Env (ExceptT EvalError IO) a }
	deriving
		( Monad,
			Functor,
			Applicative,
			MonadState Env,
			MonadIO,
			MonadError EvalError
		)
```

Then I began to implement a fundamental feature of Lisps, which is Proper Tail Call (Tail Call Optimization/TCO). A properly implemented Lisp should run the code below infinitely without growing memory usage:

```scheme
(begin
 (define loop (lambda () (loop)))
 (loop))
```

My interpreter failed at that. And cause was obvious: since I was using the `StateT` to manage environment states, my function application would have to store the current environment first, create a child environment based on the current environment, set the current environment to the child environment, apply the function, and then restore the stored environment. The last step, the "restoring", was the breaker of the Proper Tail Call, because it took the place of the "tail", which made everything that looked like the "tail" actually not the "tail".

The fix was simple and quite brute - which was to replace the `StateT` with `ReaderT` and `IORef`, this way we don't care about the environment after applying the function. The underlying reason is that `StateT` essentially is simply something like `state -> param -> (state, return)` while `ReaderT` is `env -> param -> return`, the absence of the `env` in the return value is the key to make a function call able to be a tail call.

Another important feature of Scheme is `call/cc`, which requires a CPS (Continuation Passing Style) implementation. Luckily, Haskell provides a builtin monad transformer called `ContT` which is exactly a CPS transformer:
```haskell
newtype ContT r m a = ContT { runContT :: (a -> m r) -> m r }
```

All I needed to do was to simply modify my `Eval` monad stack and the `runEval` function, none of the other code would need to be changed and the `call/cc` was free to get. So my monad stack now looks like:

```haskell
newtype Eval a = Eval { unEval :: ReaderT Env (ExceptT EvalError (ContT EvalResult IO)) a }
```

`ContT` also gave me another powerful tool, which is First-Class Continuation, or `call/cc` in Scheme. An example below:

```
opus> (define a (let ((k (call/cc (lambda (k) k)))) (begin (displayln "hey!") k)))
hey!
()
opus> (a a)
hey!
()
opus> (a 1)
hey!
()
opus> a
1
```

There's actually a better solution for it if you value performance. Since integrating `ContT` to the whole monad stack would transform all functions involving this monad to CPS, which caused a lot of closure allocation and brought performance overhead, we could only transform the `eval` to CPS and keep other parts direct-style in a more fine-grained way. But for this project, I'd value code simplicity over performance.

## The Kernel Programming Language

I started working on the macro system. But before it began I wondered: "what's the difference between a function, a macro, and a special form?":

A function takes evaluated values as parameters and output a value; A macro takes unevaluated code, or AST as it's parameter, and output another code, but actually it also outputs a value since the output code will be evaluated anyway; A special form also takes unevaluated code and outputs a value.

So we can create a concept, call it "operation" that, takes unevaluated code and outputs a value. A function is a form of "operation" that evaluates its parameters as soon as it takes them and do "operations" on these values and finally outputs the final value; A macro, on the contrast, do "operations" right on the unevaluated code, transforms it to another code, and finally evaluates and outputs it; A special form is a form that is quite similar to a macro, but it's behavior is hidden in the interpreter, it's a blackbox.

However, although we just called all those steps "evaluations", these "evaluations" differ from each other. A function evaluates its parameters in the caller's environment while it does "operations" after that in its own environment. The same applies to macros, they evaluate their final code in the caller's environment. So what would be needed if we'd like to make an "operation" that creates "operations", while we don't specifically limit it to a function or a macro? That would be the caller's environment, or the caller's evaluator.

After doing some research I found that I just happened to share the same idea with John Shutt. His Ph.D dissertation *[Fexprs as the Basis of Lisp Function Application; or, \$vau: the Ultimate Abstraction](https://web.cs.wpi.edu/~jshutt/dissertation/etd-090110-124904-Shutt-Dissertation.pdf)* described almost exactly the same idea. What I called "operation" was just fexpr or operative, and his implementation of the `$vau` primitive provided a great example for my interpreter. However, I chose another form for the "environment" value by making my `$vau` primitive passing the caller's evaluator instead of the environment. This way I eliminated the "environment" value type so I don't need to add another variant for my `SExpr` data type and think about how to represent them in a debugging output, and it also eliminated the `eval` primitive since this "evaluator" itself is the `eval` primitive. Kernel also answered one of my questions, which was that how do we "evaluate the parameters one by one" for a function, such an operation requires a `map` function which itself is a function. That's a chicken or the egg problem and Kernel answered it by explicitly providing a primitive called `wrap`, which is just an operative that wraps a operative and evaluates its parameters first then pass the result to its wrapped operative.

An example of how to define the `$lambda` operative in Opus:	

```lisp
($define! $lambda
          ($vau (params expr) env
                (env (@ wrap
                        (@ $vau params '_ expr)))))
```

With `$vau` we can implement something that was meant to be implemented only in the interpreter in formal languages, for example, an `$and`:

```lisp
($define $and
         ($vau (lhs rhs) env
               ($if (env lhs)
                    (env rhs) ; 'rhs' is only evaluated if 'lhs' is evaluated to 'false'
                    false)))
```

## Explorations on Church/Scott Encoding and Why I gave up

After I eliminated the boundaries between functions and macros, I went down a rabbit hole, started exploring how I could eliminate more boundaries so I wouldn't even need a `TypeError`. And the answer was Scott Encoding.

Scott Encoding was much like Church Encoding. They are all trying to uniform every data as a function, except that Scott Encoding is based on pattern matching while Church Encoding is based on iterations. Scott Encoding defines nature numbers as functions with a zero case and the successor case:

$$
\begin{aligned}
Nat &:= \text{Zero}\ |\ \text{Succ}\ Nat \\
0 &= \lambda zs.z \\
\text{Succ} &= \lambda n.\lambda zs.s\ n
\end{aligned}
$$
The reason why I chose Scott Encoding instead of Church Encoding lied at the definition of lists. Lists are nested pairs in Lisps, and Scott Encoding was the perfect fit for it. The definition of lists in Scott Encoding was exactly:
$$
\begin{aligned}
List &:= \text{NIL}\ |\ \text{Cons}\ \left<val\right>\ List \\
\text{NIL} &= \lambda nc.n \\
\text{Cons} &= \lambda ad. \lambda nc.c\ a\ d
\end{aligned}
$$

For not losing too much performance these functions are "optional", the underlying data is still ordinary number/list, but if it was applied as function it could behave in such ways.

The only thing left was "symbol", while traditional mathematics doesn't deal with such sort of thing, there isn't a definition for reference in both Scott Encoding and Church Encoding. So I had to create a definition for it myself, and it was: to bind a value to this symbol in the current environment, which is `define`.

My design was to make every `operatives` behave exactly the same whether they were performed on parameters they expect or parameters that have the same behavior as expected parameters. The biggest problem was how to create a definition for the `vau` parameter list binding, equivalently: how to construct a function that takes an argument list and bind it to its captured parameter list? The key was that I had this improper list parameter form which binds the rest of the arguments to it as a list, so there can be two different list "tails" in a parameter list, a `NIL` or a symbol, therefore a symbol must behave similar as `NIL`, so I modified the symbol definition to take another argument and drop it immediately so it aligned with `NIL`.

So the implementation was like

```haskell
bindAndEval :: SExpr -> SExpr -> SExpr -> Eval SExpr
bindAndEval params args expr = do
  env <- ask
  dispatch params $
    fold
      [ fold
          [ mkOp $ \_ -> do
              _ <-
                dispatch params $
                  fold
                    [ fold [quote, args],
                      SNil
                    ]
              eval expr
          ],
        opOnPair $ \p ps ->
          dispatch args $
            fold
              [ mkOp $ \as -> local (const env) $ bindAndEval params as expr,
                opOnPair $ \a as -> do
                  _ <-
                    dispatch p $
                      fold
                        [ fold
                            [quote, a],
                          SNil
                        ]
                  bindAndEval ps as expr
              ]
      ]
```

Basically what it was doing was to apply the parameters list with two constructed functions, the first one was where it was a NIL or a symbol indicating that it was an improper list, and the second one was where it was a pair. In the first branch, when we confirmed that it was a NIL or a symbol, we applied it with the rest of the arguments, this way if it was a NIL this operation simply did nothing, and if it was a symbol this line binds the rest of the arguments to it, then it evaluated the function body. We can tell from it that if the arguments were more than parameters it will apply with a proper subset of the arguments. Another branch was to do a symbol binding recursively util it hit the NIL/symbol branch.

It was quite a mess yeah? But even after implemented this I didn't gave up. I continued doing it for quite some more primitives util I got working on numbers. Dealing with numbers with signatures in Scott Encoding was very verbose. And this language is getting looking like a monster. I'd wrote code like
```lisp
('a 1 ())
('b 2 ())
(0 a b) ; = 1
```

Which is very impractical. And I started getting bored of writing primitives in two versions for such nonsense. I thought it's time to end this exploration, I've learned enough and I've been tired of it. So I finally rolled back to when it was simpler so I can explore some other interesting parts of this language.

## Standard Library / Prelude / WASM

Exploring what this language can do was funny. It turned out that I didn't even have to implement `car` and `cdr` as primitives:

```lisp
  ; since $vau immediately binds/drops the 'rest' parameter
  ; car is an O(1) operation
  ($define! car
    (($lambda ($car)
              ($lambda (lst)
                       (raw-root! (cons $car lst))))
     ; to avoid constructing an operative each time
     ($vau (x . _) _ x)))

  ($define! cdr
    (($lambda ($cdr)
              ($lambda (lst)
                       (raw-root! (cons $cdr lst))))
     ($vau (_ . x) _ x)))

```

And we could even create a module system based on `$vau` and first-class environments/evaluators.

```lisp
  ($define! child ($lambda (parent)
                           (parent (@ $let () (@ env)))))

  ($define! $import ($vau (sym) _
                          ($let ((module (child raw-root!)))
                            (module (@ $raw-import! sym)))))

  ($define! $export
    ($vau exports private
          ($let ((public (child raw-root!)))
            ($begin
              (map ($lambda (sym)
                            (public
                              (@ $define! sym (private sym))))
                   exports)
              (unwrap public)))))
```

The full prelude is on [Github](https://github.com/yaoshiu/opus). And still, you can always try it without downloading a bit by visiting the [Live Demo](https://yaoshiu.github.io/opus).
