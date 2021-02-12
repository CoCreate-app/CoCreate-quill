"use strict";
/* eslint-env browser */
// @ts-ignore

import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { QuillBinding } from 'y-quill'
import Quill from 'quill'
import QuillCursors from 'quill-cursors'
import { UserCursor } from '../y-client/src/utils/cursor/userCursor_class'

Quill.register('modules/cursors', QuillCursors)



 
window.addEventListener('load', () => {
  
  const ydoc = new Y.Doc()
  //const url_socket = `${location.protocol === 'http:' ? 'ws:' : 'wss:'}52.207.107.241:8082`
  //const provider = new WebsocketProvider(url_socket, 'uniqueRoom', ydoc)
  //const type = ydoc.getText('testUnique1')
  
  
  /**
   * Create all  Quills with class .quill
   * @private
   *
   * @development jeanmendozar@gmail.com
   * @param {None}
   */
 

  class CoCreateYjsQuill {
    
    constructor(selector) {
      this.elements = [];
      this.selector = selector;
      this.editors = [];
      this.bindings = [];
      this.organization_Id = config.organization_Id || 'randomOrganizationID'
    }
    
    _createEditor(editorContainer){
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
          });
        this.editors.push(editor);
      return editor;
    }
    
    _createBinding(type_element, editor, provider){
        let binding = new QuillBinding(type_element, editor, provider.awareness)
        this.bindings.push(binding);
      return binding;
    }
    
    _init(){
      var _this = this;
      this.elements = /** @type {any} */ (document.querySelectorAll(_this.selector))
      this.elements.forEach(function(element,index){
      
        try{  
          
          let id_type = _this.generateTypeName(element);
          
          let url_socket = `${location.protocol === 'http:' ? 'ws:' : 'wss:'}//server.cocreate.app/y-websocket`; 
          let provider = new WebsocketProvider(url_socket, id_type, ydoc)
  
          let type_element = ydoc.getText(id_type)
          
          
          /**
           * Creando la instancia Codemirror
          */
          let editor = _this._createEditor(element);
          /**
           * Creando el Binding con yjs
          */
          let binding = _this._createBinding(type_element, editor, provider);
          
          _this.adapterDB(id_type, binding.awareness.doc);
          
          new UserCursor(provider);
          
        }catch(error) {
          
          console.error(error);    
          //return false 
          
        }
        
      });//end forEach
    }
    
    generateTypeName(element) {
      try {
        
        var collection = element.getAttribute('data-collection') || '_';
        var document_id = element.getAttribute('data-document_id') || '_';
        var name = element.getAttribute('name') || '_';
        
      }catch(error) {
        
        console.error(error);    
        return false
        
      }
      const info = {org:config.organization_Id , collection, document_id, name}
      return btoa(JSON.stringify(info)); 
    }
    
    adapterDB(type_id, doc) {
      const info = this.parseTypeName(type_id);
      doc.getText(type_id).observe((event) => {
        if (!event.transaction.origin) {
          const content = event.target.toString();
          CoCreate.crud.updateDocument({
            collection: info.collection,
            document_id: info.document_id,
            data: {[info.name]: content},
            metadata: 'codemirror-update'
          })
        } 
      })
    }
    
    parseTypeName(name) {
      const data = JSON.parse(atob(name));
      return data;
    }
  
  }//end Class CoCreateYjsQuill
  
  const obj_cocreatequill = new CoCreateYjsQuill('.quill');
  /**
   * Initialization all OBJS with class .quill
  */
  obj_cocreatequill._init()

  // @ts-ignore
  window.example = { obj_cocreatequill }
  
});//end window LOAD
