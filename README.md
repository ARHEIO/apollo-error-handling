# Apollo Errors

A practical demonstration of how Apollo error handling works in different cases. As well as the obvious success state.

## Getting started

* Run `yarn install`
* Run `yarn dev`
* Open your browser on http://localhost:8888/

## The Jist

Apollo hooks return something like this:

```ts
const { data, error } = useQuery();
```

Whenever an `error` comes back, this represents a state where the client cannot recover. Things such as...

* You're not authorized to do that
* You can't delete something that's already been deleted
* Oops our API threw a runtime error

Everything else comes back in `data`, and this includes errors that a user could recover from.
