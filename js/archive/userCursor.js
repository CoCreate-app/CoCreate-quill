import * as shared from './sharedTypes.js'

import { userColor } from './usercolor.js'

//const input = /** @type {any} */ (document.querySelector('input#username'))

var  awareness;
var Ydoc;
var websocketProvider;

function generateUUID(length=null) {
    var d = new Date().getTime();
    var d2 = (performance && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;
        if(d > 0){
            var r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {
            var r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
    });
    if(length!=null){
      uuid = uuid.substr(0,length)
    }
    return uuid;
};


var cursor_user = localStorage.getItem('cursor_user')
var user_id = localStorage.getItem('user_id')
if (cursor_user == null){
    var uuid = generateUUID(4)
    let cursor_user = 'User : ' + uuid;
    localStorage.setItem('cursor_user',cursor_user)
    console.log("update name "+cursor_user)
    updateAwarenessFromLocalstorage()
}

/*
input.addEventListener('input', e => {
  localStorage.setItem('username', input.value)
  console.log("---")
  // @ts-ignore
  var conector = window.conector;
  console.log(conector)
  if (typeof(conector) != 'undefined'){
    console.log("updateddd before")
    Ydoc = conector.getDoc()
    websocketProvider = conector.getLastProvider();
    console.log("ws",websocketProvider)
    awareness = websocketProvider.awareness;
    console.log("awareness",awareness)
    
    updateAwarenessFromLocalstorage()
  }
  //updateAwarenessFromLocalstorage()
})
*/

//let conector = new shared.Connnect();
export function UpdateCursor(conector){
    //console.log("conector UPdate")
    Ydoc = conector.getDoc()
    websocketProvider = conector.getLastProvider();
    //console.log("ws",websocketProvider)
    awareness = websocketProvider.awareness;
    //console.log("awareness",awareness)
    
    
    
    
  /*  input.value = localStorage.getItem('username')
    input.removeAttribute('hidden')
*/

    addEventListener('storage', updateAwarenessFromLocalstorage)    
    awareness.setLocalStateField('user', {
      name: localStorage.getItem('cursor_user') || 'Anonymous',
      color: userColor.color,
      colorLight: userColor.light
    })
}

const updateAwarenessFromLocalstorage = () => {
    
      const localstorageUsername = localStorage.getItem('cursor_user')
      console.log(" from updateAwarenes "+ localstorageUsername)
      const awarenessState = awareness.getLocalState()
      if (localstorageUsername != null && awarenessState !== null && localstorageUsername !== awarenessState.user.name) {
        awareness.setLocalStateField('user', {
          name: localstorageUsername || 'Anonymous',
          color: userColor.color,
          colorLight: userColor.light
        })
        //input.value = localstorageUsername
      }
    }



/*

let awareness = websocketProvider.awareness;
console.log("awareness",awareness)

input.addEventListener('input', e => {
  localStorage.setItem('username', input.value)
  updateAwarenessFromLocalstorage()
})

const updateAwarenessFromLocalstorage = () => {
  const localstorageUsername = localStorage.getItem('username')
  const awarenessState = awareness.getLocalState()
  if (localstorageUsername != null && awarenessState !== null && localstorageUsername !== awarenessState.user.name) {
    shared.awareness.setLocalStateField('user', {
      name: localstorageUsername || 'Anonymous',
      color: userColor.color,
      colorLight: userColor.light
    })
    input.value = localstorageUsername
  }
}

addEventListener('storage', updateAwarenessFromLocalstorage)

if (localStorage.getItem('username') == null) {
  localStorage.setItem('username', `User ${Ydoc.clientID.toString().slice(-4)}`)
}

input.value = localStorage.getItem('username')
input.removeAttribute('hidden')

awareness.setLocalStateField('user', {
  name: localStorage.getItem('username') || 'Anonymous',
  color: userColor.color,
  colorLight: userColor.light
})
*/