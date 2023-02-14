import { FC } from 'react'
import { toAbsoluteUrl } from '../../../../_metronic/helpers'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { IconUserModel } from '../../component/core/_Models'

type Props = {
    users?: Array<IconUserModel>
}

const UsersList: FC<Props> = ({ users = undefined }) => {
    return (
        <>
            {users &&
                users.map((user, i) => {
                    return (
                        <OverlayTrigger
                            key={`${i}-${user.name}`}
                            placement='top'
                            overlay={<Tooltip id='tooltip-user-name'>{user.name}</Tooltip>}
                        >
                            <div className='symbol symbol-30px' style={{ marginLeft: i != 0 ? -18 : 0 }}>
                                {user.avatar && <img src={toAbsoluteUrl(user.avatar)} alt='Pic' />}
                                {user.initials && (
                                    <span className='symbol-label text-inverse-primary fw-bolder' style={{ backgroundColor: '#144067' }}>
                                        {user.initials}
                                    </span>
                                )}
                            </div>
                        </OverlayTrigger>
                    )
                })}
        </>
    )
}

export { UsersList }
