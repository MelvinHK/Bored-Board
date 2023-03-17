import { useCallback } from 'react';

import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import LinkIcon from '@mui/icons-material/Link';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import ImageIcon from '@mui/icons-material/Image';

import '../App.css';
import { isValidHttpUrl } from '../utils';

export function MenuBar({ editor, passImage, imageDisabled = false }) {
    const toggleLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href;
        var url = window.prompt('Enter URL:', previousUrl);

        if (url === null)
            return;

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        if (isValidHttpUrl(url)) {
            if (!url.startsWith('https://') && !url.startsWith('http://'))
                url = 'https://' + url;
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
            return;
        }
        window.alert('Invalid URL');
    }, [editor]);

    const chooseImage = () => {
        let input = document.createElement('input');
        input.type = 'file';
        input.onchange = async _ => {
            const selectedFile = Array.from(input.files)[0];
            passImage(selectedFile);
        };
        input.click();
    };

    if (!editor)
        return null;

    return (<>
        <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`rtb-menu-btns ${editor.isActive('bold') ? 'is-active' : ''}`}
            title="Bold"
        >
            <FormatBoldIcon />
        </button>
        <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`rtb-menu-btns ${editor.isActive('italic') ? 'is-active' : ''}`}
            title="Italic"
        >
            <FormatItalicIcon />
        </button>
        <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`rtb-menu-btns ${editor.isActive('strike') ? 'is-active' : ''}`}
            title="Strike"
        >
            <StrikethroughSIcon />
        </button>
        <button
            onClick={toggleLink}
            className={`rtb-menu-btns ${editor.isActive('link') ? 'is-active' : ''}`}
            disabled={editor.view.state.selection.empty && !editor.isActive('link')}
            title="Link"
        >
            <LinkIcon />
        </button>
        <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`rtb-menu-btns ${editor.isActive('bulletList') ? 'is-active' : ''}`}
            title="Bullet List"
        >
            <FormatListBulletedIcon />
        </button>
        <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`rtb-menu-btns ${editor.isActive('orderedList') ? 'is-active' : ''}`}
            title="Numbered List"
        >
            <FormatListNumberedIcon />
        </button>
        {!imageDisabled && <button onClick={chooseImage} className={`rtb-menu-btns`}>
            <ImageIcon />
        </button>}
    </>);
}

export default MenuBar;