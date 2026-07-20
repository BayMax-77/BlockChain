
# HashGuard Lite

A browser-based cryptographic timestamping experiment.

HashGuard Lite is a small Web3-oriented project created to explore the relationship between cryptography, file integrity, and blockchain timestamping.

The idea behind the application is simple:

A user selects a file, the browser generates a cryptographic fingerprint (hash) of that file, and the application estimates what it would cost to publish that fingerprint on the Bitcoin network.

The project is not only about building a tool.

It is about understanding the technologies behind it.

---

# Why this project exists

After spending several months learning the fundamentals of Web3, I wanted to move from theory to practice.

During this period, I focused on understanding concepts such as:

- how Bitcoin works;
- why blockchains are useful;
- what cryptographic hashes are;
- why data integrity matters;
- how decentralized systems verify information.

However, learning concepts without applying them eventually reaches a limit.

At some point, the best way to understand a technology is to try to build something with it.

That is where HashGuard Lite started.

---

# The original idea

The initial idea came from a discussion with my dear friend @Barbe working on a project related to document verification and blockchain timestamping.

The concept was interesting:

Instead of storing an entire document on a blockchain, why not store a cryptographic proof that the document existed at a certain moment?

The approach is based on a simple principle:

A file can generate a unique digital fingerprint.

This fingerprint is called a hash.

If the same file is hashed again later, the result should be identical.

If even a single character, pixel, or byte changes, the resulting hash becomes completely different.

This makes hashes useful for proving that information has not been modified.

---

# Why not store the entire file on the blockchain?

One of the first questions I had when discovering this concept was:

"Why not simply put the file directly on the blockchain?"

The answer is efficiency and cost.

Blockchains are not designed to store large amounts of data.

Their main purpose is to maintain a secure, distributed, and immutable record.

Instead of storing:

```
important-document.pdf
```

a blockchain timestamping system can store:

```
SHA-256 fingerprint
9f86d081884c7d659a2feaa0c55ad015...
```

The blockchain only needs the fingerprint.

Later, anyone can verify that a document corresponds to that fingerprint by calculating its hash again.

The original file remains private.

Only the proof of existence is published.

---

# Starting point

When I started this project, my technical experience was still limited.

I was learning JavaScript and had not yet worked seriously with:

- browser cryptography APIs;
- external APIs;
- asynchronous programming;
- binary data manipulation;
- modular JavaScript architecture.

The project looked simple from the outside:

"Select a file → generate a hash → estimate a Bitcoin cost."

But each step contained concepts that I had never implemented before.

The challenge was not only writing code.

The challenge was understanding what the code was actually doing.

---

# Learning by building

One of the biggest lessons from this project was changing my approach to learning.

At first, there is always the temptation to think:

"I need to learn everything before starting."

But in practice, many technical skills are acquired while solving real problems.

Instead of waiting until I felt completely prepared, I decided to start building and learn each missing piece when it became necessary.

This project became a practical learning environment.

Every feature forced me to understand a new concept:

- the file selector introduced me to the File API;
- hashing introduced me to binary data;
- Bitcoin estimation introduced me to external APIs;
- interface separation introduced me to better project organization.

---

# Building something for someone else

This project was also different because it was not created only for myself.

Most of my previous experiments were personal projects.

I could change direction whenever I wanted.

I could leave something unfinished and return later.

HashGuard Lite was different.

The idea originally came from someone else, and I wanted to contribute to making it real.

That introduced another important learning experience:

Software development is not only about writing code.

It is also about:

- understanding another person's ideas;
- communicating progress;
- organizing changes;
- making regular commits;
- documenting decisions;
- creating something maintainable.

Even for a small project, collaboration changes the way you think about development.

---

# A project with a deadline

Another important objective was learning to finish a first version.

When learning, it is easy to constantly improve things without ever reaching a finished product.

There is always:

- another feature to add;
- another refactoring to do;
- another technology to learn.

For this project, I wanted to practice a different approach:

Build a functional version first.

Then improve it.

The goal was not to create a perfect application immediately.

The goal was to create a real, working foundation that could evolve.

---

# What HashGuard Lite represents

HashGuard Lite represents a transition:

From studying Web3 concepts...

to experimenting with real applications.

From reading documentation...

to interacting with browser APIs.

From writing isolated exercises...

to organizing a complete project.

The application itself is simple, but the learning process behind it is much bigger.

This repository documents that process.


---

# How HashGuard Lite works

The application follows a simple workflow:

1. The user selects a file.
2. The browser reads the file locally.
3. A cryptographic hash is generated.
4. The hash is displayed as a hexadecimal fingerprint.
5. Current Bitcoin network information is retrieved.
6. A publication cost estimation is calculated.

An important design decision is that the file never leaves the user's computer.

The browser performs the hashing operation locally.

Only the generated fingerprint is used for the following steps.

---

# Understanding hashes

A hash function transforms input data into a fixed-size output.

For example:

```
Input:

hello world


SHA-256 output:

b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9
```

The important properties of cryptographic hashes are:

## Deterministic

The same input always produces the same output.

The same file will always generate the same hash.

---

## Sensitive to changes

A small modification creates a completely different result.

Changing only one character changes the entire fingerprint.

---

## One-way function

A hash is designed to be practically impossible to reverse.

You can generate:

```
file → hash
```

but you cannot realistically recover:

```
hash → original file
```

---

# SHA algorithms

HashGuard Lite currently supports multiple algorithms:

- SHA-1
- SHA-256
- SHA-384
- SHA-512

The project mainly focuses on SHA-256 because it is widely used in blockchain ecosystems and Bitcoin-related technologies.

SHA-1 is included for educational purposes, although it is no longer considered secure for modern cryptographic applications.

---

# Important clarification: hashes do not compress files

One of the first misunderstandings I had while learning this concept was thinking that hashing reduced file size.

This is not what happens.

A hash does not compress information.

A 5GB file and a 5KB file can both produce a SHA-256 hash of exactly 256 bits.

The purpose of hashing is not storage reduction.

The purpose is verification.

The hash acts as a digital fingerprint that proves that the original data has not changed.

---

# Browser cryptography

One of the biggest technical discoveries during this project was the Web Crypto API.

Instead of relying on an external library, modern browsers already provide cryptographic functionality.

Hash generation is performed using:

```javascript
crypto.subtle.digest()
```

The process involves several concepts:

- reading the file as binary data;
- converting it into an ArrayBuffer;
- processing bytes;
- converting the result into hexadecimal representation.

This introduced me to concepts that are usually hidden when working only with strings:

- binary data;
- bytes;
- buffers;
- encoding.

---

# Project architecture

The project is divided into different responsibilities.

The goal was not only to make the application work, but also to keep the code understandable.

## app.js

Responsible for application flow.

It manages:

- file selection;
- user actions;
- hash generation;
- communication between modules.

It does not handle visual details or external API logic.

---

## ui.js

Responsible for the user interface.

It manages:

- showing sections;
- updating displayed information;
- button states;
- copy-to-clipboard functionality;
- status messages.

The objective is to separate interface behavior from application logic.

---

## bitcoin-api.js

Responsible for Bitcoin-related information.

It manages:

- retrieving network fees;
- retrieving Bitcoin price;
- estimating publication cost.

This separation makes future improvements easier.

---

# Bitcoin publication estimation

A Bitcoin transaction has a cost based on its size and the current network fee rate.

The application retrieves:

## Network fees

Using Bitcoin mempool information.

The fee is expressed in:

```
sat/vByte
```

which represents the amount of satoshis paid per virtual byte.

---

## Bitcoin price

The current BTC/EUR exchange rate is retrieved to convert the estimated cost into euros.

---

## Transaction size estimation

The application estimates the approximate transaction size depending on the hash being published.

Different hashes have different sizes:

```
SHA-256  → 32 bytes
SHA-384  → 48 bytes
SHA-512  → 64 bytes
```

The final transaction size is only an estimation.

A real Bitcoin publication would depend on:

- transaction structure;
- inputs;
- outputs;
- OP_RETURN usage;
- wallet configuration;
- network conditions.

---

# Current features

The current version of HashGuard Lite can:

- select a local file;
- display basic file information;
- generate cryptographic hashes locally;
- support multiple SHA algorithms;
- display hexadecimal fingerprints;
- copy hashes easily;
- retrieve current Bitcoin network information;
- retrieve current BTC price;
- estimate publication costs.

Everything happens directly inside the browser.

---

# Privacy considerations

A major design goal of HashGuard Lite is respecting user privacy.

The selected file is not uploaded to a server.

The browser processes the file locally.

Only the resulting cryptographic fingerprint exists outside the original file.

This approach allows users to verify documents without exposing their contents.

---

# Future improvements

HashGuard Lite is only the first step.

Possible future developments include:

## Bitcoin integration

- creating real Bitcoin transactions;
- adding OP_RETURN support;
- publishing hashes directly on-chain;
- connecting wallets.

---

## Better timestamping workflow

Future versions could include:

- saved proofs;
- verification pages;
- downloadable certificates;
- QR codes for verification.

---

## More advanced cryptography

Possible improvements:

- additional algorithms;
- file integrity comparison;
- batch hashing;
- large file optimization.

---

# Lessons learned

This project taught me much more than JavaScript.

Technically, I learned about:

- browser APIs;
- asynchronous programming;
- cryptography fundamentals;
- binary data;
- HTTP requests;
- modular architecture;
- project organization.

But the biggest lesson was about the development process itself.

Building software is not only about knowing every tool beforehand.

It is about being able to approach unknown problems, research solutions, test ideas, and gradually transform concepts into working systems.

---

# Final thoughts

HashGuard Lite started as a simple experiment around file hashing and blockchain timestamping.

During development, it became something bigger:

A practical way to connect theoretical concepts with real implementation.

The project represents a step in my journey of understanding Web3 technologies, cryptography, and software development.

The objective was never only to create an application.

The objective was to learn how and why the technology works.

And this project is one more step in that direction.
