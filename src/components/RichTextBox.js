import { useState } from 'react';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import CloseIcon from '@mui/icons-material/Close';

import '../App.css';
import MenuBar from './RTBMenuBar';

export function RichTextBox({ getDescription, getImage, submitEvent, cancelEvent, placeholderText, imageDisabled = false, submitDisabled = false, editContent, autofocus = false }) {
    const [image, setImage] = useState();
    const editor = useEditor({
        autofocus: autofocus,
        extensions: [
            StarterKit,
            Link.configure({
                autolink: false,
                openOnClick: false
            }),
            Placeholder.configure({
                placeholder: placeholderText,
            })
        ],
        onUpdate: ({ editor }) => {
            getDescription(editor.getHTML());
        },
        content: editContent
    });

    const passImage = (file) => {
        setImage(file);
        getImage(file);
    };

    const contentInvalid = () => {
        return submitDisabled || (!image && (editor.isEmpty || editor.getText().trim().length === 0));
    };

    return (<>
        {editor && <>
            <div className='rtb'>
                <div className='rtb-menu'>
                    <MenuBar editor={editor} passImage={passImage} imageDisabled={imageDisabled} />
                </div>
                <EditorContent editor={editor} />
            </div>
            <div className='flex f-end f-center mt10'>
                {image && <>
                    <p style={{ margin: '0 5px 0 0' }}>{image.name}</p>
                    <button className='button-link' style={{ margin: '5px auto 0 0' }}
                        onClick={() => setImage()}>
                        <CloseIcon fontSize='small' />
                    </button>
                </>}
                <button
                    onClick={submitEvent}
                    className='mr10'
                    disabled={contentInvalid()}
                >
                    Submit
                </button>
                <button onClick={cancelEvent}>
                    Cancel
                </button>
            </div>
        </>}
    </>);
}

export default RichTextBox;