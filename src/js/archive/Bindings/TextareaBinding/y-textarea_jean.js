/*import Binding from '../Binding.js'
import simpleDiff from '../../Util/simpleDiff.js'

import { getRelativePosition, fromRelativePosition } from '../../Util/relativePosition.js'
 */
import * as Y from 'yjs' // eslint-disable-line
import { getRelativePosition, fromRelativePosition } from '../../Util/relativePosition.js'


function  getCursorPos(input) {
    if ("selectionStart" in input && document.activeElement == input) {
      console.log("getCursorPos selectionStart")
        return {
            start: input.selectionStart,
            end: input.selectionEnd
        };
    }
    else if (input.createTextRange) {
      console.log("getCursorPos createTextRange")
        var sel = document.selection.createRange();
        if (sel.parentElement() === input) {
            var rng = input.createTextRange();
            rng.moveToBookmark(sel.getBookmark());
            for (var len = 0; rng.compareEndPoints("EndToStart", rng) > 0; rng.moveEnd("character", -1)) {
                len++;
            }
            rng.setEndPoint("StartToStart", input.createTextRange());
            for (var pos = { start: 0, end: len }; rng.compareEndPoints("EndToStart", rng) > 0; rng.moveEnd("character", -1)) {
                pos.start++;
                pos.end++;
            }
            return pos;
        }
    }
    return -1;
}


function simpleDiff (a, b) {
  let left = 0 // number of same characters counting from left
  let right = 0 // number of same characters counting from right
  while (left < a.length && left < b.length && a[left] === b[left]) {
    left++
  }
  if (left !== a.length || left !== b.length) {
    // Only check right if a !== b
    while (right + left < a.length && right + left < b.length && a[a.length - right - 1] === b[b.length - right - 1]) {
      right++
    }
  }
  return {
    pos: left, // TODO: rename to index (also in type above)
    remove: a.length - left - right,
    insert: b.slice(left, b.length - right)
  }
}

function createMutualExclude () {
  var token = true
  return function mutualExclude (f) {
    if (token) {
      token = false
      try {
        f()
      } catch (e) {
        console.error(e)
      }
      token = true
    }
  }
}



const updateCursor = (aw, clientId, doc, type) => {
  try {
    console.log("updateCursor try")
    /*console.log(aw)
    console.log(aw.cursor)
    console.log(clientId)
    console.log(doc.clientID)*/
    if (aw && aw.cursor && clientId !== doc.clientID) {
      const user = aw.user || {}
      const color = user.color || '#ffa500'
      const name = user.name || `User: ${clientId}`
      console.log(name)
      //quillCursors.createCursor(clientId.toString(), name, color)
      /*const anchor = Y.createAbsolutePositionFromRelativePosition(Y.createRelativePositionFromJSON(aw.cursor.anchor), doc)
      const head = Y.createAbsolutePositionFromRelativePosition(Y.createRelativePositionFromJSON(aw.cursor.head), doc)
      if (anchor && head && anchor.type === type) {
        console.log(" * UpdateCursor*  ")
        console.log("anchor " , anchor)
        console.log("head " , head)
        //quillCursors.moveCursor(clientId.toString(), { index: anchor.index, length: head.index - anchor.index })
      }*/
    } else {
      console.log("quill  Removecursoir")
      //quillCursors.removeCursor(clientId.toString())
    }
  } catch (err) {
    console.error(err)
  }
}

function typeObserver () {
  this._mutualExclude(() => {
      console.log("! typeObserver")
    const textarea = this.target
    const textType = this.type
    const awareness = this.awareness
    const doc = this.doc
    console.log(this.type)
    console.log(doc)
    console.log({"text_start" : textarea.selectionStart,'text_end':textarea.selectionEnd})
    /*
    const relativeStart = getRelativePosition(textType, textarea.selectionStart)
    const relativeEnd = getRelativePosition(textType, textarea.selectionEnd)
    
    console.log({"relativeStart" : relativeStart,'text_end':relativeEnd})
    */
    textarea.value = textType.toString()
    
    
    /*const start = fromRelativePosition(textType._y, relativeStart)
    const end = fromRelativePosition(textType._y, relativeEnd)
    textarea.setSelectionRange(start, end)*/
  })
}
 
function domObserver () {
  this._mutualExclude(() => {
      console.log(this.type)
    let diff = simpleDiff(this.type.toString(), this.target.value)
    
    const textarea = this.target
    const textType = this.type
    console.log(textarea.selectionStart)
    const relativePosition = Y.createRelativePositionFromTypeIndex(textType, textarea.selectionStart)
    
    
    this.type.delete(diff.pos, diff.remove)
    this.type.insert(diff.pos, diff.insert)
    
    
    const doc = this.doc
    
    console.log("!domObserver mutal exclude")
    
        
    const absolutePosition = Y.createAbsolutePositionFromRelativePosition(relativePosition, doc)
    
    console.log('cursor location is ' + absolutePosition.index) // => cursor location is 3
    
    //textarea.setSelectionRange(absolutePosition.index, absolutePosition.index)
 
    
    
    const awareness = this.awareness
    
 
    
    console.log("awareness " , awareness)
 if (awareness){
   console.log("Entro awareness " )
   
        //const sel = textarea.getSelection()
        let length = textType.toString().length
        
        var pos = getCursorPos(textarea);
        
        if (pos != -1){
          console.log("position ",pos)      

          //console.log(pos["start"])      
          
              let start = pos.start
              let end = pos.end
              textarea.setSelectionRange(start, end)
              
              const aw = awareness.getLocalState()
              
                /*const anchor = Y.createRelativePositionFromTypeIndex(textType, start)
                const head = Y.createRelativePositionFromTypeIndex(textType, start + length)
                */
                //if (!aw || !aw.cursor || !Y.compareRelativePositions(anchor, aw.cursor.anchor) || !Y.compareRelativePositions(head, aw.cursor.head)) {
                  awareness.setLocalStateField('cursor', {
                    start,
                    end
                  })
                //}
              
              
         
            awareness.getStates().forEach((aw, clientId) => {
              updateCursor( aw, clientId, doc, textType)
            })   
            awareness.on('change', this._awarenessChange)
            
          }
          else{
            if (awareness.getLocalState() !== null) {
                  awareness.setLocalStateField('cursor', null)
                }
          }
      }
 
    
  })
}
 
/**
 * A binding that binds a YText to a dom textarea.
 *
 * This binding is automatically destroyed when its parent is deleted.
 *
 * @example
 *   const textare = document.createElement('textarea')
 *   const type = y.define('textarea', Y.Text)
 *   const binding = new Y.QuillBinding(type, textarea)
 *
 */
export class TextareaBinding  {
  constructor (textType, domTextarea,awareness) {
    // Binding handles textType as this.type and domTextarea as this.target
    //super(textType, domTextarea)
    // set initial value
    this.type = textType
    const doc = /** @type {Y.Doc} */ (textType.doc)
    this.doc = doc
    this.target = domTextarea
    this._mutualExclude = createMutualExclude()
    domTextarea.value = textType.toString()
    // Observers are handled by this class
    this._typeObserver = typeObserver.bind(this)
    this._domObserver = domObserver.bind(this)
    textType.observe(this._typeObserver)
    domTextarea.addEventListener('input', this._domObserver)
    
    this.awareness = awareness
    console.log(this.awareness)
    this._awarenessChange = ({ added, removed, updated }) => {
      const states = awareness.getStates()
      added.forEach(id => {
        updateCursor(states.get(id), id, doc, this.type)
      })
      updated.forEach(id => {
        updateCursor(states.get(id), id, doc, this.type)
      })
      removed.forEach(id => {
        console.log("remove Cursorts")
      })
    }
  }
  destroy () {
    // Remove everything that is handled by this class
    this.type.unobserve(this._typeObserver)
    this.target.unobserve(this._domObserver)
    super.destroy()
  }
}