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


/*MAKE NETWORK REQUEST WITH `FETCH()` */