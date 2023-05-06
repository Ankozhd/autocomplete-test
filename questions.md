# Answers to questions Part 2
### What is the difference between Component and PureComponent? give an example where it might break my app.
Both Component and PureComponent are base classes to create component in React.
Difference lies in how they handle updates and rerendering.

To determine if we should update a component, in react used method ```shouldComponentUpdate```
In component it returns true on any changes of props or state. However, you can override this behaviour with your own implementation.

In ```PureComponent``` by default ```shouldComponentUpdate``` makes shallow comparison of incoming state and props to current one.
This can help optimize performance by making component rerender only when really needed. 
However, using ```PureComponent``` might break your app when the props or state of component contains complex data structures and/or objects
that are frequently updated, but not properly handled by shallow comparison. In such cases component might not rerender when it should, leading to unexpected behaviour.

### Context + ShouldComponentUpdate might be dangerous. Can think of why is that?
Using ```Context``` in component allows us to subscribe to updated from parent component without need of explicitly passing the props.
If we override ```shouldComponentUpdate``` with custom implementation, we might block the updates from context by our own implementation of function.

### Describe 3 ways to pass information from a component to its PARENT.

- Callback function. We can pass callback function which sets some data in parent down to child, and then in child call it with required data, which then will process it in parent component
- React Context. We can create a shared context, that can be accessed by all components in tree. Child component can then update some values in context and Parent component can subscribe to these values.
- Flux-inspired library (Redux would be the most popular), We can have a shared state, which works similar to context. Child component then can dispatch an action -> action will be handled by reducer -> state will be updated -> all connected components (parent for example) will receive update

### What is a fragment and why do we need it? Give an example where it might break my app. 

To understand why we need ```React.Fragment``` we need to know that React Component can only render one element.
But what if we need to render multiple entities in one Component? Of course we could wrap everything in ```divs```,
but for this exact case fragment were invented. We could wrap multiple entities in one fragment, for example couple of ```<li>``` items,
that needs to be under one ```<ul>``` without any extra elements.

You should be careful and watch elements hierarchy closely to not break anything when using ```Fragments```. For example if you render some list and fail to provide correct keys to every element, React won't be able to track identity of every component.

### Give 3 examples of the HOC pattern.

HOC pattern allows us to include additional functionality by using composition approach.
Most famous examples would be:
- Redux connect function. It takes a component and returns new component connected to the redux store by using adapter methods such as ```mapStateToProps``` and    ```mapDispatchToProps```
- React Router withRouter function. It takes a component and returns new component that has access to router
- Styled Components ```withTheme``` function. It takes a component and returns new component with access to theme.

### what's the difference in handling exceptions in promises, callbacks and async...await.

- Promise. In promise you are using ```.catch()``` method to handle any errors that occures during the promise chain
  - Callback. In callbacks the error is passed as first argument to the function and you need to handle it with if. This approach is from long time ago and not recommended because leads to Callback Hell
  - Async await. Async await allows us to write async code in synchronous way (if you understand what I mean). In that case we don't need any fancy way to handle exceptions, we can use ```try catch``` blocks like in other languages. Best choice available at the moment in my opinion
  
### How many arguments does setState take and why is it async.

```setState``` takes two arguments - object with new state and callback that will run after state is updated.
```setState``` is async for performance reasons. Instead of updating immediately, React queues the update and batches multiple updates into one to optimize the performance.
And because state is not updated immediately, you have the ability to pass callback that will be executed after state updated.
(For example you can update some values from inputs in state and then use callback to calculate validity of input)

### List the steps needed to migrate a Class to Function Component.

- Change declaration from class to function
- Remove render method, jsx should be returned in ```return``` statement (forgive me for poor choice of words)
- Change how state and props are accessed. There is no longer ```this ``` keyword or ```setState``` function. Props now accessed as argument passed to component. For state you should use hook ```useState```
- Replace component lifecycle method with hooks. For example ```componentDidMount``` would be ```useEffect``` with empty array of dependencies. Logic based on some props or state need to be put in ```useEffect``` with correct dependency. (In my humble opinion, introducing hooks was the best thing in the world)

### List a few ways styles can be used with components.
- Inline styles. Perfect for fast development, bad for fixing and debugging after. Works good with dynamic styles that needs to be updated based on component.
- Define styles in separate css file and import in component. Classical way
- CSS modules. Styles can be defined in local modules. That way you don't need to worry about naming collision in your project. Usual way I've seen on some of my projects
- Styled components library. Another usual way I often see in my projects. Looks nice, allows dynamic styling. Nice approach, would recommend.

### How to render an HTML string coming from the server.
Well, classic way to do it is to use ```dangerouslySetInnerHTML``` attribute. But I wouldn't recommend it, because it exposes user to cross-site scripting attack. I would avoid to use anything with word "dangerously" in it.
When I had such task in my project, to create help section and populate it with html from server, I used 3rd party library