import React, {useState, useContext, useEffect} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import { Container } from 'react-bootstrap';
import UserContext from '../context/UserContext';
import axios from 'axios';
import { API } from '../../config/Api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArr } from "@fortawesome/free-solid-svg-icons";

const RichTextEditor = () => {
  const [comments, setComments] = useState('');
  const {text} = useContext(UserContext)
  const [newText, setNewText] = useState('');
  const [loading, setLoading] = useState(false);
  const [primaryInput, setPrimaryInput] = useState('');
  const {setText, setLabel} = useContext(UserContext)

  const modules = {
    toolbar: [
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ]
  };

  const formats = [
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'list',
    'bullet',
    'align',
    'color',
    'background'
  ];
  
  useEffect(() => {
    setNewText(text != null && text.length > 0 ? text : comments)
  })

  const getContent = (e) => {
    setLoading(true);
    e.preventDefault();
    axios.post(API.BASE_URL + 'prediction/', {
        input: primaryInput
    })
    .then(function (response) {
        console.log("Data", response.data);
        setText(response.data.Answer)
        setLabel(prevLabels => [...prevLabels, response.data.Label])
    })
    .catch(function (error) {
        console.log(error)
    })
    .finally(() => setLoading(false))
}
  
  return (
      <Container className='d-flex flex-column justify-content-between' style={{height: '95vh'}}>
        {loading && <div className='loader'><span></span></div>}
        <ReactQuill
            theme="snow"
            modules={modules}
            formats={formats}
            onChange={(content, delta, source, editor) => {
            setComments(text !=null || "" ? text : editor.getHTML());
            }}
            value={newText}
        />
        <div className="search-bar input-container w-100 position-relative">
          <input type="text" placeholder='AI writing assistant' value={primaryInput} onChange={(e) => {setPrimaryInput(e.target.value)}} />
          <button type='button' className='button button-fill' onClick={(e) => {getContent(e)}}>
            <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
          <span className='mt-3 d-flex justify-content-center text-center' style={{fontSize: 12, color: '#6c6c72 '}}>© 2023 Chatbot, All rights reserved</span>
        </div>
       
      </Container>
  );
};

export default RichTextEditor;
