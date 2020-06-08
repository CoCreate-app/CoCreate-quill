/* eslint-env browser */

import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'


import { QuillBinding } from 'y-quill'
import Quill from 'quill'
import QuillCursors from 'quill-cursors'
import  { CoCreateYSocket } from '../../codemirror/js/CoCreate-y-jean-quill'

Quill.register('modules/cursors', QuillCursors)

window.addEventListener('load', () => {
  
  
  const g_cocreateY = new CoCreateYSocket(config.organization_Id)
  
  const ydoc = new Y.Doc()
  
  let  uniquename = 'testUnique';
  //g_cocreateY.createDoc(uniquename);
  
   const url_socket = `${location.protocol === 'http:' ? 'ws:' : 'wss:'}52.207.107.241:8082`
  // //const provider = new WebsocketProvider('wss://demos.yjs.dev', 'quill', ydoc)
  
 const provider = new WebsocketProvider(url_socket, 'uniqueRoom', ydoc)
const type = ydoc.getText('testUnique1')
  
//  const provider = g_cocreateY.getProvider()
//  const type = g_cocreateY.getType(uniquename)
  
  
  
  const editorContainer = document.createElement('div')
  editorContainer.setAttribute('id', 'editor')
  document.body.insertBefore(editorContainer, null)

  var editor = new Quill(editorContainer, {
    modules: {
      cursors: true,
      toolbar: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline'],
        ['image', 'code-block']
      ],
      history: {
        userOnly: true
      }
    },
    placeholder: 'Start collaborating...',
    theme: 'snow' // or 'bubble'
  })

  const binding = new QuillBinding(type, editor, provider.awareness)

  /*
  // Define user name and user name
  // Check the quill-cursors package on how to change the way cursors are rendered
  provider.awareness.setLocalStateField('user', {
    name: 'Typing Jimmy',
    color: 'blue'
  })
  */

  const connectBtn = document.getElementById('y-connect-btn')
  connectBtn.addEventListener('click', () => {
    if (provider.shouldConnect) {
      provider.disconnect()
      connectBtn.textContent = 'Connect'
    } else {
      provider.connect()
      connectBtn.textContent = 'Disconnect'
    }
  })

  window.example = { provider, ydoc, type, binding }
})