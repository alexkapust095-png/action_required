import './Participants.css'

import { ProjectedAppItem, OrgInfo } from "@/types/types";
import { escapeHtml } from "../../utils/escapeHtml";


export function Participants(props: { sender: ProjectedAppItem<OrgInfo> | undefined, participants: ProjectedAppItem<OrgInfo>[] | undefined }) {
    return (
        <div className="task-table-cell task-participants">
            {props.sender && (
                <div
                    className="sender-title"
                    dangerouslySetInnerHTML={{ __html: escapeHtml(props.sender.data.__name) }}
                />
            )}
            {props.participants &&
                props.participants.map(participant =>
                    <div
                        key={participant.id}
                        className="participant-title"
                        dangerouslySetInnerHTML={{ __html: escapeHtml(participant.data.__name) }}
                    />
                )
            }
        </div>
    )
}
