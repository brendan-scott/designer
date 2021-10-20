import {Tab} from "react-bootstrap";

export const NotesPane = () => {
    return (
        <Tab.Pane eventKey="notes">
            <div>
                <textarea className="form-control form-control-sm" rows="25" spellCheck="true"/>
            </div>
        </Tab.Pane>
    )
}