import React, { useState }  from "react";
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import Zoom from '@mui/material/Zoom';

function CreateArea(props) {
   const [note,setNote] = useState({
       title:"",
       content:""
       //这里不需要设置_id。id是从MongoDB返回的，只要把返回的document作为要显示的Array的内容，就可以用_id了。
   });
   function updateNote(event) {
    console.log(event.target.name);
       console.log(event.target.value);
       const {name, value} = event.target;
       setNote((prevNote)=>{
           return {
               ...prevNote,
               [name]:value
           }
       })
       console.log(note);
   } 
   function submitNote(event){
    // event.preventDefault(); 
    props.onChecked(note);
    setNote({
        title:"",
content:""
    })
   }
   const[isClicked, setClicked]=useState(false);
   function changeLayout(){
    setClicked(true);
   }
  return (
    <div>
      <form className="create-note">
      {isClicked
      ? <input onChange={updateNote} value={note.title}name="title" placeholder="Title" />
      :null}
        <textarea onClick={changeLayout} onChange={updateNote} value={note.content}name="content" placeholder="Take a note..." 
        rows={isClicked?"3":"1"}/> 
        <Zoom in={isClicked?true:false}>
        <Fab 
        onClick={submitNote}
        ><AddIcon/></Fab>
        </Zoom>
      </form>
    </div>
  );
}
export default CreateArea;
