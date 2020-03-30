/*THE PROBLEM WITH CALLBACKS

geolocation is available on the window object and can get access with 'navigator.geolocation'.

geolocation provides a number of helpful methods to get a users position in the world, specifically method called
getCurrentPosition() which accepts a callback function. callback function will be given the position data when its
retrieved. can use function declaration or arrow function. use arrow function in this example, which will be passed 
the position data.

example of async code is setTimeout() where we wait a period of time before executing some code. another example
is addEventListener(). you don't want an app that will stop running until a certain event takes place, like a mouse click or 
timer to finish. async code is non-blocking. meaning the code will continue to work as javascript is doing things 
such as fetching a users position. this is a benefit of async code. 
*/
navigator.geolocation.getCurrentPosition(position => {   //arrow function will be passed the position data. 
    console.log(position) 
})
console.log('done')   //returns done 1st then Position after. the expectation is 2nd line should run after Position. 

/*getCurrentPosition() does what it needs to do to get user position. this process takes a certain period of time. when it gets the 
position data, it passes data to the callback function, and i can do with the data what i like. if i want code to run after 
getCurrentPosition(), i need to put the code inside the callback function. stuffing the code into a single callback function is 
not a great way to organize code. in addition, if i have multiple asynchronous operations that i need to perform after getting the 
position. 
*/
navigator.geolocation.getCurrentPosition(position => {
    console.log(position) 
    console.log('done') 
}) 

/*to get restaurants based off a position, can structure code as follows:

function getRestaurants() does not exist, but can create one. the problem here is the remaining code 'console.log('done')'
has to be stuffed in the last callback. another problem is the lack of ability to manage this code. the highly nested structure 
that emerges with multiple callbacks is referred to as 'callback hell'. final problem with callbacks for creating asynchronous operations
is when using multiple callback based functions, you create this hierarchy of functions that are dependent upon one another to resolve
successfully. imagine the problem if there was an error with getting the position of the 1st callback. on top of that, do not get info 
about the execution of functions, we just deal with the data when it comes back and hope program does not break in the process. this issue
is called the 'inversion of control problem'. we don't have control of the program. we are giving the program to the callbacks and hope 
that they resolve as they should. newer javascript features allows for better handle of asynchronous code.  
*/
navigator.geolocation.getCurrentPosition(position => {
    console.log(position) 
    getRestaurants(position, restaurants => {
        console.log(restaurants) 
        console.log('done') 
    })
    
}) 

/*FIX CALLBACK HELL WITH PROMISES 

promises were added to javascript to make dealing with async code easier. promises informs status of async code that is executing. 
unlike the callback based pattern, promises give me control. 

create promises with promise constructor function  new Promise(). provide a callback to the constructor function  new Promise(() => {})
promises still implement callbacks, but a callback that gives control over how code is resolved. 2 arguments are needed  resolve & reject
can provide function declaration or arrow function:
    new Promise((resolve, reject) => {}) 

States of a promise:
    pending
    fulfilled
    rejected

by default, when a promise is created it has a value of pending and wait for it to be resolved. with a promise i create myself, must 
manually resolve it depending on whether the operation was determined to be successful or not. this is where resolve and reject come 
into play. resolve and reject are both function themselves. resolve allows me to change the status of a promise to fulfilled. 
reject allows me to change the status of a promise to rejected. 

as we know, constructor functions create objects which have their own properties and methods. all created promises can invoke 2 methods  
then() and catch(), both of which accepts their own functions. when resolve() is called, the code will execute the function that is 
passed to the then() method. if reject() is called, the code will execute the function that is passed to the catch() method. 
    promise.then(() => {}).catch(() => {})

when promise is resolved, log 'success', if rejected, log 'failure':
    promise.then(() => console.log('success')).catch(() => console.log('failure')) 

for every promise only 1 resolve or reject function can be executed. cant call both promise AND reject. 
the promise is either fulfilled  OR rejected. since then() and catch() are methods, can utilize method chaining. 

finally is a new Promise() method which enables me to run code when the promise is resolved regardless if successful or not. 
at the very end, chain on finally(). reminder that then or catch will be run before finally. 

using the power of promises can more easily and logically write async code 

*/

/* 
because using a constructor function, will get an instance of Promise returned when code runs. the initial status is pending. however, 
the promise was not resolved with the value that was passed to the resolve function ('done'). need to listen to changes with promises 
for when they are fulfilled or rejected.   
*/
const promise = new Promise((resolve, reject) => {   //resolve and reject functions need to follow this order.  
    setTimeout(() => resolve('done'), 1000)         //pass setTimeout() arrow function and resolve value 'done' after 1 second
  }) 
  console.log(promise)  //returns an instance of Promise. 

/* 
calling resolve() and the code will execute the function that is passed to the then() method. then() callback runs because promise 
is resolved. the catch() callback does not run. but still not getting the value that was passed to the resolve() function. 
*/
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve('done'), 1000)   
  }) 
  promise.then(() => console.log('success')).catch(() => console.log('failure'))  //returns success  

/* to get the 'done' value, need to update then():
    from the parameters of the then() callback, provide a parameter which will give access to value passed in resolve() function */
const promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve('done'), 1000)   
  }) 
  promise.then(value => console.log(value)).catch(() => console.log('failure'))  //providing parameter 'value', getting access to 'done' via console.log()

/* rejecting promise with reject() function w/o passing function anything. catch() callback will run and return failure */
const promise = new Promise((resolve, reject) => { 
    setTimeout(() => reject(), 1000)     //updating to reject. not passing anything
  })  
  promise.then(value => console.log(value)).catch(() => console.log('failure'))  //returns failure

/* throwing an error when rejecting promise. providing Error() with a message 'Promise failed'.
can receive the error within the parameters of catch(). to better indicate error, use console.error() for better formatting. 
returns Error: Promise failed. */
const promise = new Promise((resolve, reject) => {
    setTimeout(() => reject(Error('Promise failed.')), 1000)   //passing reject() with Error() with text 'Promise failed'
  })  
  promise.then(value => console.log(value)).catch(error => console.error(error))  //providing parameter 'error' which give access to value 
                                                                                 //passed in error() function. using console.error() for better
                                                                                 //formatting. passing parameter error to console.error()

/*using finally. then or catch will still be run before finally() */                                                                                
const promise = new Promise((resolve, reject) => {
    setTimeout(() => reject(Error('Promise failed.')), 1000)   
  })  
  promise
    .then(value => console.log(value))
    .catch(error => console.error(error))
    .finally(() => console.log('done'))   //returns Error: Promise failed. done

/*using promise to manage/control geolocation.getCurrentPosition() 

    when we get position from the callback, the promise is resolved successfully. so can pass the position data to resolve.
    if get getCurrentPosition() fails, method has another callback for any errors  which is right after the 1st callback. this
    grants access to the error data. use an arrow function and within arrow function reject promise with error data. 

    get promise instance from the constructor and put in a variable called promise. with this reference, can use method chaining
    with then() and catch() to resolve the fulfilled or rejected promise. 
        promise.then().catch().finally()
    
    since passing data to resolve() and reject()  resolve(position) and reject(error) respectively. can get their values in the 
    then() and catch() callbacks. with then(), getting the position, so console.log position data. 
    for catch() getting error, so console.log error data. 
    use finally() method to implement the 'done' console log designed to run after everything is finished. 
*/
const promise = new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(position => { //callback receives position data and passes data to 'position'. when data from callback received, promise is resolved
     resolve(position)                                     //pass position data to resolve()
   }, error => {                                           //another callback for errors which grants access to error data
      reject(error)                                        //passing error data to reject()
   })  
 }) 
 promise                                                   //can now get values for position and error with then() and catch()
   .then(position => console.log(position))                //providing parameter 'position' and using it to get access to value passed in resolve()
   .catch(error => console.error(error))                   //providing parameter 'error' and using it to get access to value passed in reject()
   .finally(() => console.log('done'))                     //log 'done' after  then() or catch() completes. 
                                                          //returns Position first followed by done
 

/* to make code more succinct, can pass resolve() and reject() as references to the success and error callbacks. this saves 
step from writing them out entirely as functions. resolve() and reject() are still going to be passed the position and error 
values  */
const promise = new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)  
 }) 
 promise
   .then(position => console.log(position))
   .catch(error => console.error(error))
   .finally(() => console.log('done')) 


/*MAKE NETWORK REQUEST WITH `FETCH()` 

Application Programming Interface (API) is a means for software to communicate with other software. in a word, API is a helpful service. 
the geolocation feature on the windows object is a type of API: window.navigator.geolocation. 

REST API - if there is a 'type' of data, a REST API may have been created for it. this includes weather data. to get the data, use 
javascript to make a network request, aka, an ajax request. 

data is commonly used in applications via CRUD. usually create, read, update and delete data. REST API''s give the equivalent of these
operations when working with remote data. to create new data with REST API, need to create a POST request. POST is the name of the http
method which is a piece of data that tells the API what I want to do. sending the request with a POST method will cause the API to create
a new resource. use GET method if just want to request a resource from the API to read it. to update a resource with data that already 
exists, use PUT or PATCH methods. to delete a resource remotely, perform a DELETE request. 

Both POST and PUT/PATCH require data to be provided on the request to be able to create or update the resource. while GET and DELETE 
request just require either the GET or DELETE method to be provided w/o any data to get or delete. 

CRUD: 
create POST  = /posts/
read GET     = /posts/1
update PUT / PATCH
delete DELETE

http://jsonplaceholder.typicode.com/posts  -> an API that give post data from a blog API
http://jsonplaceholder.typicode.com  -> all the routes/endpoints u can make requests to and appropriate HTTP method to use for each  
https://github.com/public-apis/public-apis -> table of API's. Off category = NO means no authentication/API key to required to use

simplest way to make a network request is by using a browser, which performs a GET request and returns the data. JSON data is the 
primary format of data sent over web thru these requests. JSON stands for JavaScript Object Notation.

fetch() requires a url to make a request to. the url is called an API endpoint. 

making a GET request with fetch() to a single endpoint, the '/posts/1' endpoint. this will fetch a single blog post. to make GET request, 
execute fetch() as a function. the 1st argument is the endpoint i want to get data from:
    fetch('https://jsonplaceholder.typicode.com/posts/1')

this statement returns a Promise. do not have to write Promises on my own because they are baked into many tools such as fetch(). 
to get the data, chain on then(). for every request made, get back a response, which is an object that includes alot of info. want the
data from the response body, which is the data interested in when making the request. in this case, interested data would be the post. 

the response body isn't always in the form needed, usually need to convert to a format javascript can handle. fetch() contains many methods
which helps convert the response body data to a useable format. can convert body to json data with response.json(). this is a method on the
response. make sure to call the method -> response.json() and not write as a property -> response.json.
the response.json() method also returns a Promise. to resolve this Promise, will need another then() callback. get data with this 
particular then().

to add a new blog post, use the route '/posts' which accepts POST requests. so route will be:
    fetch('https://jsonplaceholder.typicode.com/posts')

need to pass 2nd argument, a configuration object option. since making a post request, declare method property as 'POST'. since POST
creates a new resource (want to provide a blog post). so need to provide blog post data with the request typically as JSON data. 1st need
to tell API sending JSON data to it. to do that, put a special string on request called a header. use the header, which tells the data/or 
contact type being sent over (which is JSON data). so create an object (headers) and set on headers the property Content-Type to the string
application/JSON.  

                fetch('https://jsonplaceholder.typicode.com/posts', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json" 
                },
                })

finally will need the body property. need to create a resource with an object that contains the properties title, body and userid. 
creating an object with properties: 

                const blogPost = {
                title: "Cool post",
                body: "lkajsdflkjasjlfda",
                userId: 1  
                }

now need to convert object to JSON because its the data type being sent. use JSON.stringify() to convert, which will be provided on body 
property. 

                fetch('https://jsonplaceholder.typicode.com/posts', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify(blogPost)
                })

need to address possibility of having a problem with request. for example, if make a GET request to non-existing endpoint:

            fetch('https://jsonplaceholder.typicode.com/pots/1')  -> misspelled posts
            .then(response => response.json())
            .then(data => console.log(data))

in this example an empty object {} will be returned. the fetch() promise will resolve even with a failing status code. empty {} is an
indication from API that request failed. a failed request will not run the catch() callback. to have catch() handle the failed request 
(by console logging the error). need to detect error myself. to do that, can use property on the response called ok. changing arrow
function to have a normal function body. response.ok will be set to true indicating a successful response if it has a status code. 
meaning an indication from REST API as to the success or failure of the request. it will be successful response if status code in 200 
range. if not in 200 range, response.ok is false, meaning request failed. if response.ok is false, throw error message 'Oops'. when 
throw an error in this callback, catch() will immediately catch error in the catch() callback:

                fetch('https://jsonplaceholder.typicode.com/pots/1')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Oops!')   
                    }
                })

or throw status code from response. better approach because provides info on why request failed. can get from response.status:

                fetch('https://jsonplaceholder.typicode.com/pots/1')
                .then(response => {
                    if (!response.ok) {
                        throw new Error(response.status)   
                    }
                })

errors with status in 400 range means there was a problem with how the request was made. could be made by programmer or user
errors with status in 500 range means there was a problem with the server. 

will work with GET and POST the most when working with REST API's. */


 /*GET /posts/1 - returns a single blog post. data returned as an object with following properties: 

 {userId: 1, id: 1, title: "sunt aut facere repellat provident occaecati excepturi optio reprehenderit"
 body: "quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est 
 autem sunt rem eveniet architecto"}
*/
fetch('https://jsonplaceholder.typicode.com/posts/1')  //providing fetch() an endpoint only using route /posts/1
  .then(response => response.json())
  .then(data => console.log(data))

/*can interact with object. getting title property:
    sunt aut facere repellat provident occaecati excepturi optio reprehenderit
*/
fetch('https://jsonplaceholder.typicode.com/posts/1')
  .then(response => response.json())
  .then(data => console.log(data.title))


/*POST /posts returns added blog post.  also returns a custom id property (id: 101). this was generated by REST API to confirm 
successful post was created.

main difference between GET and POST requests is the 2nd argument in POST request. 2nd argument includes method, headers and body. 

returns new post {title: "Cool post", body: "lkajsdflkjasjlfda", userId: 1, id: 101}
*/
const blogPost = {                           //creating resource for body  (creating object for body property)
    title: "Cool post",
    body: "lkajsdflkjasjlfda",
    userId: 1  
  }
  
  fetch('https://jsonplaceholder.typicode.com/posts', {  //request returns a Promise. using route /posts. 2nd argument includes method, headers and body
    method: "POST",
    headers: {                                                                        
       "Content-Type": "application/json"              //set on headers the property Content-Type to the string application/JSON
    },
    body: JSON.stringify(blogPost)                      //JSON.stringify() converts the blogPost object to JSON
  })
    .then(response => response.json())  //getting data with then(). converting response body data to json. response.json() method returns a Promise.
    .then(data => console.log(data))    /*resolving Promise from response.json() in the 1st then() callback above. using another then() 
                                          callback to get the data. providing parameter 'data' and using it to gain access to the data from 
                                          the response body */
            

/*program makes a GET request to a non-existing endpoint (misspelled 'posts' in fetch() method)
a failed request will not run the catch() callback. need to detect error myself. using response.ok to detect error.
if error occurs and is thrown in callback, catch() will immediately catch error in the catch() callback: 

returns Error: 404 (which means resource not found)
*/
fetch('https://jsonplaceholder.typicode.com/pots/1')
  .then(response => {                                 //changing from arrow function to normal body function.       
      if (!response.ok) {                             //!response.ok = false, meaning status code not generated, thus resulting in error                           
        throw new Error(response.status)   
      }
  })
  .then(data => console.log(data))
  .catch(error => console.error(error))              //error immediately caught in catch() callback 
  

/*Challenge: Sending data between server and client. 
The JSON Placeholder API has /users endpoint, just like the one we saw in the tutorial for /posts.
Get the user with ID 3 and log their name and company they work for. Handle errors if something does not quite work. 
 Here's the endpoint: https://jsonplaceholder.typicode.com/users/3
*/
fetch("https://jsonplaceholder.typicode.com/users/3")  //returns a Promise
.then(response => {                                    //when Promise resolved, use then() to get access to the response, which is an object
    console.log(response)                              //returns a response object
    if (!response.ok) {                                //if response evaluates as false/falsy, throw an error
        throw new Error(response.status) 
    }
    return response.json()  //else convert response object to json file. return object to be able to work with data. generates another Promise
})
.then(person => {  //when Promise from response.json() is resolved, get direct access to the response object
    console.log(`${person.name} works for ${person.company.name}`) 
})
.catch(err => console.log(err))   //catches any error and throws error response code/status


/*DEAD-SIMPLE PROMISES WITH ASYNC-AWAIT 

summary of program below:

fetch('https://jsonplaceholder.typicode.com/posts/1')
  .then(response => response.json())
  .then(data => console.log(data)) 

1. first use fetch() function to make a request for a single post data from the /posts/1 endpoint. 
2. get back response in the 1st then() callback and use the json method off of response to convert response body to json data.
3. in the 2nd then() get actual object data. which logs to the console.


there is an alternative way of this Promise that doesn't require multiple callback functions. can make it look like synchronous code
where can resolve the Promise and immediately put it in a variable. 

1. first create a function that declares what i want the Promise to do. since i want the function to resolve the Promise, i can add the 
keyword async in front of function keyword: 
    async function getBlogPost() {}
    
to write an arrow function, the async will be before the function parameters  since its the beginning of the arrow function itself:
    const getBlogPost = async () => {}

using async keyword before a function always returns a Promise. 




*/

/*
any function prepended with the async keyword automatically returns a Promise. 
if there is not an error in the function body when executed, the Promise will be fulfilled or resolved successfully. 
then() access the data returned from a successful Promise. 
*/
async function getBlogPost() {}
getBlogPost().then(() => console.log('works as a promise'))  //returns works as a promise. 

/*if i return a value 'works here too!' from the function, unless returns an error, the value will be passed to the then() callback.
to display in browser, get the value being passed to the resolve() function. then get the value in the parameters of then() and do 
what i want with data (console.log(value)) */
async function getBlogPost() {
    return resolve('works here too!')   
  }  
  getBlogPost().then(value => console.log(value))   //returns works here too!

/*  *****************************OVERVIEW OF PROMISES/THEN()
notes provides an overview of how traditional Promises are created, 
how new Promises are subsequently created and how to resolve the promises. also, how then() is used to gain access to the data from
the resolved promises. 

program creates a traditional Promise with a Promise constructor and creates a new Promise instance within the getBlogPost() function. 
function mimics an API call with a set setTimeOut()

excluding callback passed to setTimeOut(), there are 3 functions being created for just 1 blog post/1 value:
    Promise(), then(), finally(). 

*/
function getBlogPost() {
    const promise = new Promise((resolve, reject) => {  //promise constructor with required parameters.
      setTimeout(() => resolve('blog post'), 1000)     //pass setTimeOut() a function to resolve a text blog post after a second. 
    }) 
    
    promise                                           //grab a reference to the new promise. to resolve the new promise:
      .then(value => console.log(value))              //use then() to get value passed to resolve ('blog-post') and console.log it
      .finally(() => console.log('done'))             //when all is done, use finally() and within finally() callback, console.log 'done'
  }
  getBlogPost()  //running function


/*
not using then() and finally() but instead telling getBlogPost() function to pause until the Promise is resolved. and after its resolved, 
put the resolved value in a variable, and only then continue the function till the end to run 'done' console log. 

this can be accomplished by declaring function 'async' but also using the 'await' keyword. await performs the following:
    1. pauses code on the line its used
    2. resolves promise when its placed before a promise
    3. allows for immediate use of the resolve value 
    4. resumes the function

the following program displays power of async-await -> removes the need for callback functions and is readable. 

the syntax does not replace promises. i am merely wrapping promises in a better syntax. i cannot resolve promises with await unless its
within a function thats prepend with async keyword. async can work without await. but await cannot work without async. 
*/
async function getBlogPost() {
    const promise = new Promise((resolve, reject) => {  //function will be on hold until the promise is resolved
      setTimeout(() => resolve('blog post'), 1000) 
    }) 
    
    const result = await promise   //putting resolved promise in variable called result. after resolving promise, function will resume
    console.log(result)            //console.logging the promise variable 
    console.log('done')            //since function has resumed, can do whatever i want afterwards

  }
  getBlogPost()                 //calling function. program runs each line in the proper order  'blog post' followed by 'done'

/*making async network request look like synchronous code (no callback functions). 
this program pauses functions to wait for an awaited promise to resolve so code runs in the exact order written. 

1. create function with async keyword. with async keyword, function returns a promise. (this promise is expected to resolve, no need to await)

2. since calling fetch() request returns a promise, can use await to resolve this particular promise. 
can immediately do what i like with the result, which i am getting back as the response.  (similar to -> .then(response)
then put the response object in a variable.  

3. next, to get the json data, call response.json(). since response.json() returns a promise, 
need to await the promise from response.json(). now put the variable from this expression into a variable called data.
next console.log data or do whatever i want with it. 

4. finally call the function. */

async function getPost() {  //create function with async keyword, returns a promise. 
    const response = await fetch('https://jsonplaceholder.typicode.com/posts/1')   //use await to resolve promise produced from fetch(). 
    const data = await response.json()   //response.json() returns a promise. need to await promise. putting into variable 'data' 
    console.log(data)                    //console log 'data' or do whatever i want afterwards
 }
 getPost()    //call function


 /* CATCH ERRORS WITH ASYNC-AWAIT 

 Promise.reject() is the easiest way to reject a promise. when using await, will not get an error. 

 within an async function, if you await on a promise that gets rejected, javascript will throw a catchable error. need a way to catch 
 this error, which is typically done with a try/catch. try/catch is a very helpful way of handling errors in async code because its useful
 for handling code with synchronous errors that are not caught until run time when the code is executed. 

 the await keyword is what converts the rejected promises to catchable errors. 

 it is important to put forth effort to catch a promise. because in many cases when a promise does not operate as expected, want to 
 inform the user of application about the unsuccessful promise. hopefully the user can possibly fix the problem. this process provides 
 opportunity to inform user what is taking place and what they can do to fix it. 
 */

async function runAsync() {
    await Promise.reject()   //purposely rejecting a promise
    console.log('hi') 
}
  runAsync()   //returns nothing. the promise will silently fail. the function will never run

/*can inform programmer/user of error by using try{} and catch. in try, put all code that i want to run successfully. put all errors in 
catch (receive the error in a pair of parenthesis  catch(error). can handle error by using console.error(error) and passing the error 
to it. 
 */
async function runAsync() {
    try { 
      await Promise.reject()   
    } catch (error) {
      console.error(error)  
    }  
  } 
  runAsync()  //returns null

/*to see an error, pass in a created error and pass in message. program will run, promise gets rejected, and gets logged to the console.
this handles the event of managing a failed promise. 
*/
async function runAsync() {
    try { 
      await Promise.reject(Error('Oops'))   
    } catch (error) {
      console.error(error)  
    }  
  }  
  runAsync()  //Error: Oops

/*try/catch catches synchronous and asynchronous errors */
async function runAsync() {
    try { 
      await Promise.resolve('hello world')  
      null.someProperty = true    //attempting to add a property to null. 
    } catch (error) {
      console.error(error)  
    }  
  }
  runAsync()   //returns TypeError: Cannot set property 'someProperty' of null

/*the await keyword is what converts the rejected promises to catchable errors. need the await keyword when using return*/
async function runAsync() {
    try { 
      //return Promise.reject(Error('Oops'))  //this will cause catch to not run. need await keyword
      return await Promise.reject(Error('Oops'))  //adding await will will return Error: Oops
      // null.someProperty = true  
    } catch (error) {
      console.error(error)  
    }  
  }
  runAsync() 

/*
 in addition to a try/catch, can use another pattern which takes advantage of fact that every function prepended with async returns a
 promise. this patten can catch errors from resolving promise by chaining the catch method when calling function. this allow for catching
 values that are passed to reject. can further pass error to console.error(error). this program returns Error: Oops. 
 */
async function runAsync() {
    return await Promise.reject(Error('Oops'))  //can send error to catch()
  }
  runAsync().catch(error => console.error(error))  //chaining catch(). catching values passed to reject and further passing value to console.error()

/*program makes a request to a REST API (API that allows to get users from github). function designed to get the users github data, but 
may experience a problem doing so (user may not exist). want to throw an error when promise is not successful.

the approach is to set up a try/catch. where in try, put code to successfully resolve promise, otherwise catch errors that may take place,
and log with console.error(). due to the nature of fetch(), need to manually throw error myself in order to catch error. this can be done
by if statement (!response.ok). if response.ok is not true, then throw a new error code from response.status.
*/
async function getGithubUser() {
    try {    
      const response = await fetch('https://api.github.com/users/laksjdflasjfdlkjadfjk')  //user name is followed by users/
      if (!response.ok) {                  //due to nature of fetch(), need to manually throw error to catch. if response.ok = false, 
        throw new Error(response.status)   //throw error code from response.status                    
      }
    } catch (error) {                      //catches new error from the throw syntax
      console.error(error)                 //logs new error from throw syntax 
      console.log('Could not fetch user, try resetting your connection')   //can provide user with detailed message
      alert(error.message)   //if error message had detailed info from status, can provide user additional instructions. 

    } 
  }
  getGithubUser()  //returns Error: 404 because user unable to be found. 

/*Challenge: 
Rewrite the GET API call from the previous challenge using async-await

fetch('https://jsonplaceholder.typicode.com/users/3')
  .then(response => {
      if (!response.ok) {
        throw new Error(response.status)   
      }
      
      return response.json()
  })
  .then(person => console.log(`${person.name} works for ${person.company.name}`))
  .catch(err => console.error(err))  
*/
async function getUser() {
    const response = await fetch('https://jsonplaceholder.typicode.com/users/3')  
    console.log(response)  //now have access to data. this is a response object, need to response.json() as a result.
    const person = await response.json()   //response.json occurs asynchronously, so need to await. store response in variable
    console.log(person)  //now have access to person
  } 
  getUser()

/*making program a bit more robust in order to handle errors by wrapping in a try/catch statement. telling javascript to try everything
in try{}. if anything fails, catch{} the error.
*/
async function getUser() {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users/3') 
      if (!response.ok) {  //if evaluates to false, throw error
        throw new Error(response.status) 
      }
      const person = await response.json() 
      console.log(person)     
    }
      catch (error) {   //catch error and log it
        console.log(error) 
    }
  
  } 
  getUser()