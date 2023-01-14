import { useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import FormatBoldIcon from '@mui/icons-material/FormatBold'
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import LinkIcon from '@mui/icons-material/Link';
import TitleIcon from '@mui/icons-material/Title';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import '../App.css'

const MenuBar = ({ editor }) => {

    function isValidHttpUrl(str) {
        const pattern = new RegExp(
            '^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', // fragment locator
            'i'
        );
        return pattern.test(str);
    }

    const toggleLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href
        var url = window.prompt('Enter URL:', previousUrl)

        if (url === null)
            return

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }

        if (isValidHttpUrl(url)) {
            if (!url.startsWith('https://') && !url.startsWith('http://'))
                url = 'https://' + url
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
            return
        }
        window.alert('Invalid URL')
    }, [editor])

    if (!editor)
        return null

    return (
        <>
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
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`rtb-menu-btns ${editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}`}
                title="Heading"
            >
                <TitleIcon />
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
        </>
    )
}

export function RichTextBox({ getContent }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                autolink: false,
                openOnClick: false
            }),
            Placeholder.configure({
                placeholder: 'Text',
            })
        ],
        onUpdate: ({ editor }) => {
            // Validation
            const html =
                editor.isEmpty || editor.getText().trim().length === 0 ?
                    '' :
                    editor.getHTML()
            getContent(html)
        }
    })
    return (
        <div className='rtb'>
            <div className='rtb-menu'>
                <MenuBar editor={editor} />
            </div>
            <EditorContent editor={editor} />
        </div>
    )
}

export default RichTextBox