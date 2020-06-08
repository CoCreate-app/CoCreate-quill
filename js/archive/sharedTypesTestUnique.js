
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'


export const doc = new Y.Doc()

//var url_socket = `${location.protocol === 'http:' ? 'ws:' : 'wss:'}52.207.107.241:8082`; 
const url_socket = `${location.protocol === 'http:' ? 'ws:' : 'wss:'}//server.cocreate.app/y-websocket`; 
export const websocketProvider = new WebsocketProvider(url_socket, 'uniqueRoom', doc)
//export const websocketProvider = new WebsocketProvider('wss://demos.yjs.dev', 'quill-testing', doc)
export const awareness = websocketProvider.awareness
// @ts-ignore
window.ydoc = doc
// @ts-ignore
window.awareness = awareness
// @ts-ignore
window.websocketProvider = websocketProvider
