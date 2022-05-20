import { fetchWithTimeout } from './fetch.js';
var authToken = '51f74aff963eb3151f504eab39ff851def286f11ee919f299445';
var nameSearchResults = {};
export var loggedIn = false;
export var loggingIn = false;
var fmpErrorCodes;

fetch("./fmperrorcodes.json")
.then(
	response => {
		console.log(response);
		if (!response.ok) {
			throw new Error("HTTP error " + response.status);
		}
		return response.json()
	})
.then(result => {fmpErrorCodes = result})
.catch(error => console.log('error reading errorcodes', error));


const reportStatus = (status) => {
document.getElementById("status").innerHTML = status;
//document.getElementById("status").style.display="block";

}

const updateStatus = (status) => {
document.getElementById("status").innerHTML = document.getElementById("status").innerHTML.concat(status);
//document.getElementById("status").style.display="block";

}

const clearStatus = (status) => {
document.getElementById("status").innerHTML = "";
//document.getElementById("status").style.display="none";

}

const clearResultsList = () => {
nameSearchResults = {};
document.getElementById("namesList").innerHTML = "";
document.getElementById("results-box").style.display="none";
document.getElementById("result-description").innerHTML = "";
}


	  
  export async function logIn()  {
	if (loggingIn) return;
	loggingIn = true;
	const auth = process.env.REACT_APP_FMP_AUTH;
		var authHeaders = new Headers();
		authHeaders.append("Content-Type", "application/json");
		authHeaders.append("Authorization", auth);

		var authRequestOptions = {
				method: 'POST',
				headers: authHeaders,
				timeout: 6000
			// redirect: 'follow'
		};
		//console.log("fetching authorization", authRequestOptions);
	try {

		const response = await fetchWithTimeout("https://aidsquilt.360works.com/fmi/data/v1/databases/PMDB/sessions", 
												authRequestOptions);
		const result = await response.json();
	
		//console.log("authResponse", result);
		authToken=result.response.token;
		loggedIn = true;
		loggingIn = false;
		return (result);
		}
	catch(error) 
		{
			//Promise.reject(new Error('not logged in, ignoring find request", query_string')).then(function() {
				// not called
			  //}, function(error) {
				loggingIn = false;

				console.error('log in error', error); // Stacktrace
			 // });
		}
}

const handleServerErrors = (response) => {
	if (!response.ok) {
		if (response.status === 401) {
			//logIn();
			//searchPanelListings();
			throw Error("not logged in", response);
		} else if (response.status === 500) {
			//
			// Ugh, fmp returns a 500 Internal Server error for empty find result
			//
			console.log("fmp returns a 500 Internal Server error for empty find result");
			//response.ok=true;
		}
		else {
		throw Error("server responded",response.status.toString() 
			+ ":" +response.statusText);
		}
	}
	return response;
}

const logDBError= (message, searchTerm) => {
	console.log("Fetch error:", searchTerm, message[0].code, fmpErrorCodes[message[0].code]);
}
export const getFieldNames = () => {
	return new Promise((resolve, reject) => {
		if (loggedIn) {
			var myHeaders = new Headers();
			myHeaders.append("Content-Type", "application/json");
			myHeaders.append("Authorization", "Bearer "+ authToken);
			let queryURL = "https://aidsquilt.360works.com/fmi/data/v1/databases/PMDB/layouts/DataAPI";

			var requestOptions = {
				method: 'GET',
				headers: myHeaders,
				redirect: 'follow'
			};
			//console.log(loggedIn, "finding", query_string);
			fetch(queryURL, requestOptions)
			.then(handleServerErrors)
			.then(response => {
				resolve(response.json());
			})
			.catch(error=>{
				console.error('fecth Error:', error); 
				reject(error);
			});
		} else {
			logIn().catch((error) => {
				console.error('login Error:', error); });
			console.log('not logged in, ignoring find request');
			reject(new Error('not logged in, ignoring find request, query_string'));
		}
	})

}
export const find = (query_string) => {
	
	return new Promise((resolve, reject) => {
		if (loggedIn) {
			var myHeaders = new Headers();
			myHeaders.append("Content-Type", "application/json");
			myHeaders.append("Authorization", "Bearer "+ authToken);
			let queryURL = "https://aidsquilt.360works.com/fmi/data/v1/databases/PMDB/layouts/DataAPI/_find";

			var requestOptions = {
				method: 'POST',
				headers: myHeaders,
				body: query_string,
				redirect: 'follow'
			};
			//console.log(loggedIn, "finding", query_string);
			fetch(queryURL, requestOptions)
			.then(handleServerErrors)
			.then(response => {
				resolve(response.json());
			})
			.catch(error=>{
				console.error('fecth Error:', error); 
				reject(error);
			});
		} else {
			logIn().catch((error) => {
				console.error('login Error:', error); });
			console.log('not logged in, ignoring find request', query_string);
			reject(new Error('not logged in, ignoring find request, query_string'));
		}
	})

}
// TODO: fill these out and move to interface files
function displaySingleBlock () {}
function displayByPage () {}
function displayOneBlock () {}

export const searchPanelListings = (searchTerm='') => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer "+ authToken);
    let queryURL = "https://aidsquilt.360works.com/fmi/data/v1/databases/PMDB/layouts/DataAPI/_find";
    if (searchTerm === '') {
		const searchField = document.getElementById("search");
        if (searchField !== null ) searchTerm = searchField.value;
        if (searchTerm === '') { 
            return; 
        }
        let blockNumber = parseInt(searchTerm);
        if ( !isNaN(blockNumber)) {
            searchTerm = blockNumber;
        } 
    }
    let queryType = typeof searchTerm;
    switch  (queryType) {
              
    case 'string':
            clearStatus();
            clearResultsList();
            reportStatus("Looking for blocks that include the name &ldquo;" + searchTerm + "&rdquo;...");
            // TODO: reset map view
			//viewer.viewport.goHome(false);
            searchTerm = searchTerm.replace(/\*/g, '').trim();
            var initialQuery = JSON.stringify({"query":[{"Panel Listing":"*"+[searchTerm]+"*"}],"limit": "1", "offset": "1"});

            find(initialQuery)
            .then(json => {
                let foundCount = 0;
                if (Object.keys(json.response).length !== 0) {
                    //
                    // empty find result returns respnse == {} but messages will have an FMP error code
                    //
                    foundCount = json.response.dataInfo.foundCount;
                } else {
                    logDBError(json.messages, searchTerm);

                }
                if (foundCount === 0) {
                    reportStatus("Sorry, couldn't find any matches for the name &ldquo;" + searchTerm + "&rdquo;.");
                } else if (foundCount === 1) {
                    displaySingleBlock(json.response.data[0].fieldData["Block #"], searchTerm);
                } else  { //if ( foundCount > pageSize )
                    updateStatus("Found " + foundCount);
                    displayByPage(searchTerm, foundCount);
                }
            })
            .catch((error) => {
              console.error('Error:', error);
              return Promise.reject();
            })  ;
            break;
        case 'number':
            displayOneBlock(searchTerm);
            break;
        
        case 'boolean':
            break;    
		default:
			break;
    }

    return false; 
    
}  


// TODO:
// figure out how many actual names there are 
// figure which panels have multiple makers
// figure out all the multiple same names
// Date(Month(Creation Date); Day(Creation Date); Year(Date Received))
// Date(Month(Creation Date); Day(Creation Date); 1992)

// const important_dates = {
// 	"mall1987" : 0, 248,
// 	"1987" : 249, 307,
// 	"mall1988" : 308, 1036,
// 	"1988" : 1037, 1061,
// 	"1989" : 1062, 1388,
// 	"1990" : 1389, 1674,*
// 	"1991" : 1675, ~1947*
// 	"mall1992" : ~1948, 2508,*
//  "1992" : 2509, 2546,*
// 	"1993" : 2547, 3171,*
// 	"1994" : 3172, 3500,*
// 	"1995" : 3501, 3990
// 	"mall1996" : 3991, 4927,
// 	"1996" : 4928, 4973
// 	"1997" : 1005,
// 	"1998" : 1005,
// 	"1999" : 1005,
// 	"2000" : 1005,
// 	"2001" : 1005,
// 	"2002" : 1005,
// 	"2003" : 1005,
// 	"2004" : 1005,
// 	"2005" : 1005,
// 	"2006" : 1005,
// 	"2007" : 1005,
// 	"2008" : 1005,
// 	"2009" : 1005,
// 	"2010" : 1005,
// 	"2011" : 1005,
// 	"2012" : 1005,
// 	"2013" : 1005,
// 	"2014" : 1005,
// 	"2015" : 1005,
// 	"2016" : 1005,
// 	"2017" : 1005,
// 	"2018" : 1005,
// 	"2019" : 1005,

// }