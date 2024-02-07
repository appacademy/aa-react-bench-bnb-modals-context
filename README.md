# BenchBnB, Bonus: Make The Login And Signup Form Pages Into Modals (Context Version)

Rather than redirecting to the sign up page when there isn't a current user,
(for instance on the `BenchForm`), it would be nice if there was a session modal
that just overlaid the page. Then, after signing up or logging in, the modal
could close and the user's context would not be lost.

In this bonus Phase, you will enhance the user experience by using a modal for
log in / sign up to preserve context.

**Note:** There are many ways to implement modals. The steps below use React
context, but you could just as easily use Redux.

## Step 1: Create modal context

First, make a folder in __frontend/src__ called __context__. Add a file in the
__context__ folder called __Modal.jsx__. Create a React context called
`ModalContext`.

Create and export a function component called `ModalProvider` that renders the
`ModalContext.Provider` component with all the `children` from the props as a
child. **Make sure to export it as a named export, not a default export.**
Render a `div` element as a sibling right after the `ModalContext.Provider`.

Create a React ref called `modalRef` using the [`useRef`] React hook. Set the
`ref` prop on the rendered `div` element to this `modalRef`. `modalRef.current`
will be set to the actual HTML DOM element that gets rendered from the `div`.

```jsx
// frontend/src/context/Modal.jsx

import { useRef, createContext } from 'react';

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const modalRef = useRef();

  return (
    <>
      <ModalContext.Provider>
        {children}
      </ModalContext.Provider>
      <div ref={modalRef} />
    </>
  );
}
```

Create a state variable `value`. In a `useEffect` with an empty dependency
array, set this `value` to `modalRef.current`. Pass `value` into the
`ModalContext.Provider` as the `value` prop.

```jsx
// frontend/src/context/Modal.jsx

import { createContext, useRef, useState } from 'react';

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const modalRef = useRef();
  const [value, setValue] = useState();

  useEffect(() => {
    setValue(modalRef.current);
  }, []);

  return (
    <>
      <ModalContext.Provider value={value}>
        {children}
      </ModalContext.Provider>
      <div ref={modalRef} />
    </>
  );
}
```

Import the `ModalProvider` component in __frontend/src/main.jsx__ and wrap your
`App` with it:

```jsx
// frontend/src/main.jsx

// ...
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ModalProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </ModalProvider>
  </React.StrictMode>
);
```

## Step 2: Create a `Modal` component using `createPortal`

To enable any component to open a modal, you will use ReactDOM's
[`createPortal`]. As the name suggests, `createPortal` enables a component to
render its children in a different part of the DOM.

Back in __frontend/src/context/Modal.jsx__, import `createPortal` from
`react-dom`.

Create a function component called `Modal` and destructure `onClose` and
`children` from its props. Export it as a named export.

The `Modal` component should consume the value of the `ModalContext`--i.e., the
node where the modal should go, call it `modalNode`--by using the `useContext`
React hook. Return `null` if `modalNode` is falsy.

Otherwise, render a `div` with an `id` of `modal`. Inside, nest two `div`s:

1. A `div` with an `id` of `modal-background`
2. Another `div` with an `id` of `modal-content`

In the `modal-content` div, render the `children`.

Add an `onClick` listener to the `modal-background` so that when it is clicked,
the `onClose` function should be invoked.

The `modal-background` div needs to be rendered **before** the `modal-content`
because it will naturally be placed "behind" the depth of the `modal-content`
if it comes before the `modal-content` in the DOM tree.

To get these elements to show up in the `div` referenced by the `modalRef` in
the `ModalProvider` component, pass the `div` with the `id` of `modal` and all
its nested elements as the first argument of `createPortal`. Pass the value of
`modalNode` as the second argument of `createPortal`. This will transfer all
those elements as the children of the `div` referenced by the `modalRef` in the
`ModalProvider` component. Remember, the value of `modalRef.current` is the
reference to the actual HTML DOM element of the `ModalProvider`'s `div`. Return
the invocation of `createPortal` from the `Modal` component.

```jsx
// frontend/src/context/Modal.jsx
import { useRef, useState, useEffect, useContext, createContext } from 'react';
import { createPortal } from 'react-dom';

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const modalRef = useRef();
  const [value, setValue] = useState();

  useEffect(() => {
    setValue(modalRef.current);
  }, []);

  return (
    <>
      <ModalContext.Provider value={value}>
        {children}
      </ModalContext.Provider>
      <div ref={modalRef} />
    </>
  );
}

export function Modal({ onClose, children }) {
  const modalNode = useContext(ModalContext);
  // If there is no div referenced by the modalNode, render nothing:
  if (!modalRef || !modalRef.current || !modalContent) return null;

  // Render the following component to the div referenced by the modalRef
  return createPortal(
    <div id="modal">
      <div id="modal-background" onClick={onClose} />
      <div id="modal-content">
        {children}
      </div>
    </div>,
    modalNode
  );
}
```

Add a CSS file in the __context__ folder called __Modal.css__. The `modal` div
should have a `position` `fixed` and take up the entire width and height of the
window. The `modal-background` should also take up the entire width and height
of the window and have a `position` `fixed`. The `modal-content` div should have
a `position` of `absolute` and be centered inside of the `modal` div by flexing
the `modal` div. You may want to give the `modal-background` a
`background-color` of `rgba(0, 0, 0, 0.7)` and the `modal-content` a
`background-color` of `white` just to see them better. Give the `modal-content`
div a `border-radius` of `10px`.

```css
/* frontend/src/context/Modal.css */

#modal {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999; /* prevents any other element from showing on top of modal */
}

#modal-background {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
}

#modal-content {
  position: absolute;
  background-color: white;
  border-radius: 10px;
}
```

Import the __Modal.css__ file into the __Modal.jsx__ context file.

Your __Modal.jsx__ file should now look like this:

```jsx
// frontend/src/context/Modal.jsx

import { createContext, useContext, useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const modalRef = useRef();
  const [value, setValue] = useState();

  useEffect(() => {
    setValue(modalRef.current);
  }, []);

  return (
    <>
      <ModalContext.Provider value={value}>
        {children}
      </ModalContext.Provider>
      <div ref={modalRef} />
    </>
  );
}

export function Modal({ onClose, children }) {
  const modalNode = useContext(ModalContext);
  if (!modalNode) return null;

  return createPortal(
    <div id="modal">
      <div id="modal-background" onClick={onClose} />
      <div id="modal-content">
        {children}
      </div>
    </div>,
    modalNode
  );
}
```

## Step 3: Create a reusable `SessionModal`

To create a reusable `SessionModal`, make a __components/SessionModal__
directory with a __SessionModal.jsx__ file, a __SessionModal.css__ file, and,
optionally, an __index.js__ file. Also move the `LoginForm` and `SignupForm`
component files to this directory. (You can delete the __session__ folder now.)

Create and export as the default a generic `SessionModal` component in
__SessionModal.jsx__. It should receive `onClose`, `onSuccess`, and `login` as
props. (Default `login` to `true`.) It should return a `Modal`, passing through
its `onClose` prop like this:

```jsx
// frontend/src/components/SessionModal/SessionModal.jsx

  return (
    <Modal onClose={onClose}>
      <div className="session-modal">
        {/* Modal content */}
      </div>
    </Modal>
  );
```

For the modal content, `SessionModal` should render either the `LoginForm` or
the `SignupForm`, with a button at the bottom that toggles between the two (so a
user could easily switch forms).

Once you finish, render a `SessionModal` on the `BenchForm` page if there is no
current user. Now when you go to the `BenchForm` page, a `Login` modal should
appear over the page if no one is logged in. Nice!

Add `SessionModal`s anywhere else that requires a current user.

## Step 4: Unify login and signup protocols

With `SessionModal`, your `/login` and `/signup` routes are a bit redundant.
Let's unify the session protocol by eliminating those routes and using the
`SessionModal` for all logging in and signing up.

To do this, you'll need to adjust your `Navigation` component so that it opens a
`SessionModal` when a user clicks `Login` or `Signup` instead of navigating to a
route. If you've made it this far, you can figure out the logic for how to do
this on your own. Just keep two points in mind:

1. The modal that opens should correspond to the button that was clicked (i.e.,
   `Login` or `Signup`).
2. The modal should close whenever someone clicks outside the modal or the modal
   successfully completes its task.

Once you get the `Navigation` component working, you can go ahead and eliminate
the redundant `login` and `signup` routes from your router.

Congratulations! You've added modals to BenchBnB!

[`createPortal`]: https://react.dev/reference/react-dom/createPortal
