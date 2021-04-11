
/* eslint-env browser */
// @ts-ignore

import * as Y from 'yjs'
import { QuillBinding } from './js/y-quill_binding'
import Quill from 'quill'
import QuillCursors from 'quill-cursors'
import { UserCursor } from '@cocreate/crdt/src/utils/cursor/userCursor_class'
import crud from '@cocreate/crud-client'
import crdt from '@cocreate/crdt'
import CoCreateForm from '@cocreate/form'
import CoCreateObserver from '@cocreate/observer'

Quill.register('modules/cursors', QuillCursors)


//window.addEventListener('load', () => {
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
			this.organization_Id = config.organization_Id || 'randomOrganizationID';
			this.themeQuill = 'snow'
			this.onNewEditor = null;
			//this.themeQuill = typeof window.config.themeQuill != 'undefined' ? window.config.themeQuill : 'snow';
		}
		
		_createEditor(editorContainer){
			let themeQuill = editorContainer.dataset['theme'] ? editorContainer.dataset['theme'] : this.themeQuill
			console.log("ThemeQuill => "+themeQuill)
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
					theme: themeQuill // 'snow' or  'bubble'
				});
			this.editors.push(editor);
			if(this.onNewEditor)
				this.onNewEditor(editor);
			return editor;
		}
		
		_createBinding(type_element, editor, provider){
				let binding = new QuillBinding(type_element, editor, provider.awareness)
				this.bindings.push(binding);
			return binding;
		}
		
		initYSocket(element, editor) {
			const { collection, document_id, name } = crud.getAttr(element)

			if (collection && name && document_id) {
				const id = crdt.generateID(config.organization_Id, collection, document_id, name);
				crdt.createDoc(id, element);
				
				let provider = crdt.getProvider(id)
				let doc_type = crdt.getType(id)
				
				let binding = this._createBinding(doc_type, editor, provider)
				
				setTimeout(function() {
					if (element.crudSetted) {
						return;
					}
					// CoCreate.getDocument({
					// 	collection: collection,
					// 	document_id: document_id,
					// 	metadata: {
					// 		type: 'crdt'
					// 	}
					// })
				}, 1000);
				new UserCursor(provider);
			}
		}
		
		init(container) {
			this._init(container)
			this.initSocketEvent()
		}
		
		_init(container){
			var _this = this;
			const mainContainer = container || document;
			
			let elements = mainContainer.querySelectorAll('.quill')
			
			if (elements.length == 0 && mainContainer.classList && mainContainer.classList.contains('quill')) {
				elements = [mainContainer];
			}
			
			
			elements.forEach(function(element,index){
				if (CoCreateObserver) {
					if (CoCreateObserver.getInitialized(element, "cocreate-quill")) {
						return;
					}
				}
				try{  
					
					/**
					 * Creando la instancia Codemirror
					*/
					
					let editor = _this._createEditor(element);
					_this.initYSocket(element, editor)
					_this.initEvent(element, editor)
					
					if (CoCreateObserver) {
						CoCreateObserver.setInitialized(element, "cocreate-quill")
					}
					_this.elements.push(element)
					
				}catch(error) {
					
					console.error(error);    
					//return false 
					
				}
				
			});//end forEach
		}
		
		initSocketEvent() {
			const self = this;
			// CoCreateSocket.listen('getDocument', function(data) {
			// 	if (!data.metadata || data.metadata.type != "crdt") {
			// 		return;
			// 	}
				
			// 	self.elements.forEach((quill) => {
			// 		const collection = quill.getAttribute('data-collection')
			// 		const id = quill.getAttribute('data-document_id')
			// 		const name = quill.getAttribute('name')
					
			// 		if (quill.crudSetted === true) {
			// 			return;
			// 		}
			// 		if (data['collection'] == collection && data['document_id'] == id && (name in data.data)) {
			// 			crdt.replaceText({
			// 				collection: collection,
			// 				document_id: id,
			// 				name: name,
			// 				value: data['data'][name],
			// 			})
			// 			quill.crudSetted = true;

			// 		}
			// 	});
			// 	// self.editors.forEach((editor) => {
			// 	// 	const el = editor.options.container
			// 	// 	const collection = el.getAttribute('data-collection')
			// 	// 	const id = el.getAttribute('data-document_id')
			// 	// 	const name = el.getAttribute('name')
					
			// 	// 	if (el.crudSetted === true) {
			// 	// 		return;
			// 	// 	}
			// 	// 	if (data['collection'] == collection && data['document_id'] == id && (name in data.data)) {
			// 	// 		// crdt.replaceText({
			// 	// 		// 	collection: collection,
			// 	// 		// 	document_id: id,
			// 	// 		// 	name: name,
			// 	// 		// 	value: data['data'][name],
			// 	// 		// })
						
			// 	// 		editor.setText(data['data'][name]);
			// 	// 		el.crudSetted = true;
			// 	// 	}
			// 	// });
			// });
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
				let { collection, name, document_id } = crud.getAttr(element)
				collection = collection || '_'
				name = name || '_'
				document_id = document_id || '_'
				const info = { org:config.organization_Id , collection, document_id, name }
				return btoa(JSON.stringify(info)); 
			}catch(error) {
				return false
			}
		}

		requestDocumentID(element) {
			const document_id = element.getAttribute('data-document_id');
			const realtime = crud.isRealtimeAttr(element);
			if (!document_id && realtime) {
				CoCreateForm.request({element})
				element.setAttribute('data-document_id', 'pending');
			}
		}
		
		saveDataIntoDB(element, value) {
			const { collection, document_id, name } = crud.getAttr(element)
			if (!crud.isSaveAttr(element) || document_id == 'null') {
				return;
			}
			crdt.replaceText({
				collection, document_id, 
				data: {
					[name]: value,
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
	obj_cocreatequill.init()

	// @ts-ignore
	window.CoCreateQuill = obj_cocreatequill

	if (CoCreateObserver) {
		CoCreateObserver.init({
			name: 'CoCreateQuill', 
			observe: ['subtree', 'childList'],
			include: '.quill', 
			callback: function(mutation) {
				CoCreateQuill._init(mutation.target)
			}
		})
		
	}
	
	if (CoCreateForm) {
		CoCreateForm.init({
			name: 'CoCreateQuill',
			selector: '.quill',
			callback: function(el) {
				
			}
		})
	}
	
//});//end window LOAD
