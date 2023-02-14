import { FC } from 'react'
import { toAbsoluteUrl } from '../../../_metronic/helpers'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { IconUserModel } from './core/_Models'

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
                            show={false}
                            overlay={<Tooltip id=''></Tooltip>}
                        >
                            <div className='symbol symbol-40px' style={{ marginLeft: i !== 0 ? -8 : 0 }}>
                                {user.avatar && <img src={toAbsoluteUrl(user.avatar)} alt='Pic' />}
                                {user.initials && user.numbers !== 0 && (
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
