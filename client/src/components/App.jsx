import React , { useState }  from "react";
import Header from "./Header";
import Note from "./Note";
import Footer from "./Footer";
import CreateArea from "./CreateArea";
import axios from "axios";

const url = "http://localhost:4747";
/*** Remember that the proxy to the backend server is http://localhost:8000 ***/

function App() {
  const [items,setItems] = useState([]);
  
  React.useEffect(() => {
    axios.get(url+"/")
      .then((res) => {
        // console.log(res.data);
        //包含_id
        setItems(res.data);
      })
      .catch((err) => console.error(err));
  }, []);
  function addItem(note){
    setItems(prevItems=>[...prevItems,note])
    console.log(items);
    //这里console.log时，尽管页面已经显示了3个notes，log出来的却是两个objects。
    axios.post(url+"/add", note)
    // .then((res) => {
    //   setItems(prevItems=>[...prevItems,res.data]));
    //没有这条then依然能添加进MongoDB里，所以去掉。
    .catch((err) => console.log(err));
    }
    function deleteItem(id){
      // console.log(id);
      // setItems(prevItems=>{
      //   const deleteOneIndex=
      //   prevItems.findIndex((findItem)=>{
      //  return findItem._id=id});
      //  console.log(deleteOneIndex);
      //   return prevItems.filter((item,index)=>{
      //     return index !== deleteOneIndex;
      //   })
      // })
      // //设置这个setItem的思路是：既然已经有了id，可以把现在notes中相同id的这个note的序号找出来，用filter滤掉。
      // //不管它在数据库里有没有删除，显示的notes和数据库不完全同步，只要能看见的notes可以立刻删除，对用户来说就已经删除了，后台可以慢一步删掉
      // //目的是让用户看到的界面能实时添加和删除，但是失败了
      // //尝试把CreatArea中button的onClick绑定的函数中的event.preventDefault()删掉了
      // //但还是不会一操作就刷新
      // //也尝试在server的delete部分写了res.redirect("/")还是失败了
      // /***有个问题：怎么能让它每次操作都刷新？为什么add能立刻刷新，delete不行？是因为add在原界面操作，而delete在add的基础上操作吗***/
      axios.post(url+"/delete",{_id:id})
      .then((res)=>{
        console.log(res.data);
        setItems(res.data);
      //这里的res.data是包含MongoDB中现有objects的array
      })
      // 这里（和server.js中 delete部分那个note.find是一起的）与上面的setItems部分相互替换，但都有一个问题：没有办法增加之后很快删除，
      //上面的方法（findIndex）增加后需要先刷新页面，再点击删除才能删掉；且不能连续操作
      // 即：比如一共有三个notes，刷新界面后点击删除，第一个会立刻被删除，但之后的就没反应了，必须再刷新才能删除。
      //这个方法比上面那个好一些，不需要刷新界面，多点几下delete按钮就能删除了。
      .catch((err) => console.log(err));


    }
    return (<div>
      <Header />
      <CreateArea onChecked={addItem}/>
      {items.map((NoteItem,index)=>{
        return <Note 
        onChecked={deleteItem}
        key={index} 
        id={NoteItem._id}
        //items在get("/")那一步就有了_id（从res.data中来的），因此可以指定_id。
        title={NoteItem.title} 
        content={NoteItem.content} />
      })}
      <Footer />
    </div>);
};
export default App;