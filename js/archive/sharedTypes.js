
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'



export class Connnect {
    constructor() {
        this.listconnections = [];
        this.doc = new Y.Doc();
        this.lastProvider = false;
    }
    connect(url,room){
        this.doc = new Y.Doc();
        this.type = this.doc.getText(room);
        this.lastProvider = new WebsocketProvider(url, room, this.doc);
        var con = {'url':url,'room':room,'websocketProvider':this.lastProvider,'type':this.type};
        return con;
    }
    addconnect (url,room) {
        var con = this.connect(url,room)
        this.listconnections.push(con);
        return con;
    }
    addconnectToIndex (url,room,index) {
        var con = this.connect(url,room)
        this.listconnections[index] = con;
        return con;
    }
    getLastProvider(){
        return this.lastProvider;
    }
    getDoc(){
        return this.doc;
    }
    getType(){
        return this.type;
    }
    getListConnections(){
        return this.listconnections;
    }
}

export const doc = new Y.Doc()
var url = `${location.protocol === 'http:' ? 'ws:' : 'wss:'}52.207.107.241:8082`; 
export const websocketProvider = new WebsocketProvider(url, 'quill', doc)
//export const websocketProvider = new WebsocketProvider('wss://demos.yjs.dev', 'quill', doc)
export const awareness = websocketProvider.awareness
// @ts-ignore
window.ydoc = doc
// @ts-ignore
window.awareness = awareness
// @ts-ignore
window.websocketProvider = websocketProvider
