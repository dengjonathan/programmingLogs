This is where I keep a programming journal of things I've learned along the way with some
light tooling to help make things easier.

**Setup**
After cloning this repo, you can run with the following commands

Install libraries:
```
npm install
```

Begin running journal
```
npm start
```

**Tasks To Do**

* add some way for a long running process to automatically create a journal entry if it is a new day: the complexity here is that I don't want to create a lot of unused journal entries so I need to delete the entries with no content (or not create them in the first place)

* indexing: it would be nice to index certain content (snippets, related entries) for searching, but I still don't know what the search use case would be, and I could just use grep until i have some custom need

* make add some structure journal input.  The 700words app allows you to enter some things to track day to day, i.e. energy levels, sleep, but I'm not sure what I would want from a programming journal.  And would I want this in my programming journal or my Evernote?