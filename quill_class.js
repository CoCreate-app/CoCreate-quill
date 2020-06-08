"use strict";
/* eslint-env browser */
// @ts-ignore

import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { QuillBinding } from './js/y-quill_binding'
import Quill from 'quill'
import QuillCursors from 'quill-cursors'
import { UserCursor } from '../y-client/src/utils/cursor/userCursor_class'

Quill.register('modules/cursors', QuillCursors)


window.addEventListener('load', () => {

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
    
    initYSocket(element, editor) {
      let collection = element.getAttribute('data-collection')
      let name = element.getAttribute('name')
      let document_id = element.getAttribute('data-document_id')

      if (collection && name && document_id) {
        const id = CoCreateYSocket.generateID(config.organization_Id, collection, document_id, name);
        CoCreateCrdt.createDoc(id, element);
        
        let provider = CoCreateCrdt.getProvider(id)
        let doc_type = CoCreateCrdt.getType(id)
        
        let binding = this._createBinding(doc_type, editor, provider)
        new UserCursor(provider);
      }
    }
    
    _init(){
      var _this = this;
      this.elements = /** @type {any} */ (document.querySelectorAll(_this.selector))
      registerModuleSelector(_this.selector)
      
      this.elements.forEach(function(element,index){
      
        try{  
          
          /**
           * Creando la instancia Codemirror
          */
          
          let editor = _this._createEditor(element);
          _this.initYSocket(element, editor)
          _this.initEvent(element, editor)
          
        }catch(error) {
          
          console.error(error);    
          //return false 
          
        }
        
      });//end forEach
    }
    
    initEvent(element, editor) {
      let _this = this;
      editor.on('editor-change', function(){
        
        var value = editor.getText();
        var id = element.getAttribute('id');
         _this.requestDocumentID(element)
         
        if (!id) return;
        
        var targets = document.querySelectorAll('[data-get_value="' + id + '"]');
        
        targets.forEach((target) => {
          if(target.nodeName == 'IFRAME'){
              let document_iframe = target.contentDocument;
            	target.srcdoc = value;
              
          }else{
            if (typeof(target.innerHTML) != "undefined") {
            	target.innerHTML = value;
            }else if (typeof(target.value) != "undefined") {
            	target.value = value;
            } else if (typeof(target.textContent) != "undefined") {
            	target.textContent = value;
            }
          }
        });
      });
      element.addEventListener('set-document_id', function(event){
        const old_data = editor.getText();
        _this.initYSocket(element, editor, old_data);
        _this.saveDataIntoDB(element, old_data);
        
      })
      
      element.addEventListener('clicked-submitBtn', function() {
        const old_data = editor.getText();
		    _this.saveDataIntoDB(element, old_data);
		    editor.setText(old_data)
      })
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

    requestDocumentID(element) {
      const document_id = element.getAttribute('data-document_id');
      const realtime = element.getAttribute('data-realtime') != "false";
      if (!document_id && realtime) {
        CoCreateDocument.requestDocumentId(element)
        element.setAttribute('data-document_id', 'pending');
      }
    }
    
    saveDataIntoDB(element, value) {
      const collection = element.getAttribute('data-collection')
      const document_id = element.getAttribute('data-document_id')
      const name = element.getAttribute('name')
      if (element.getAttribute('data-save_value') == 'false') {
        return;
      }
      CoCreate.replaceDataCrdt({
        collection, document_id, name, value,
        update_crud: true
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
