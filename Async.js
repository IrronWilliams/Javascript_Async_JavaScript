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
    navigator.geolocation.getCurrentPosition(position => { //when position data from callback received, promise is resolved
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
create POST
read GET
update PUT / PATCH
delete DELETE

http://jsonplaceholder.typicode.com/posts  -> an API that give post data from a blog API
http://jsonplaceholder.typicode.com  -> all the routes/endpoints u can make requests to and appropriate HTTP method to use for each  
https://github.com/public-apis/public-apis -> table of API's. Off category = NO means no authentication/API key to required to use

simplest way to make a network request is by using a browser  which performs a GET request and returns the data. JSON data is the 
primary format that data sent over web thru these requests. JSON stands for JavaScript Object Notation

fetch(url) requires a url to make a request to. the url is called an API endpoint. 

making a get request with fetch() to a single endpoint, the /posts/1 endpoint. this will fetch a single blog post. to make get request, 
execute fetch() as a function. the 1st argument is the endpoint i want to get data from:
    fetch('https://jsonplaceholder.typicode.com/posts/1')

this statement returns a Promise. do not have to write Promises on my own because they are baked into many tools such as fetch(). 
to get the data, chain on then(). for every request made, get back a response, which is an object that includes alot of info. want the
data from the response body, which is the data wanted when making the request. in this case, would be the post. 

the response body isn't always in the form needed, usually need to convert to a format javascript can handle. fetch() contains many methods
which helps convert the response body data to a useable format. can convert body to json data with response.json(). this is a method on the
response. make sure to call the method -> response.json() and not write as a property -> response.json.
the response.json() method also returns a Promise. to resolve this Promise, will need another then() callback. get data with this then()

to add a new blog post, use the route '/posts' which accepts POST requests. so route will be:
    fetch('https://jsonplaceholder.typicode.com/posts')

need to pass 2nd argument, a configuration object option. since making a post request, declare method property as 'POST'. since POST
creates a new resource, want to provide a blog post. so need to provide blog post data with the request typically as JSON data. 1st need
to tell API sending JSON data to it. to do that, put a special string on request called a header. use the header, which tells the data/or 
contact type being sent over (which is JSON data). so create an object (headers) and set on headers the property Content-Type to the string
application/JSON.  


                fetch('https://jsonplaceholder.typicode.com/posts', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json" 
                },
                })


finally will need the body property. need to create a resource with an object that contains the properties title, body and userid. create 
an object with properties: 

                const blogPost = {
                title: "Cool post",
                body: "lkajsdflkjasjlfda",
                userId: 1  
                }

now need to convert object to JSON because its data type being sent. use JSON.stringify() to convert  which will be provided on body 
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
function yo have a normal function body. response.ok will be set to true indicating a successful response if it has a status code. 
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
const blogPost = {          //creating resource for body  object created for body
    title: "Cool post",
    body: "lkajsdflkjasjlfda",
    userId: 1  
  }
  
  fetch('https://jsonplaceholder.typicode.com/posts', {  //using route /posts. 2nd argument includes method, headers and body
    method: "POST",
    headers: {
       "Content-Type": "application/json" 
    },
    body: JSON.stringify(blogPost)                      //JSON.stringify() converts object to JSON
  })
    .then(response => response.json())
    .then(data => console.log(data))

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
  

