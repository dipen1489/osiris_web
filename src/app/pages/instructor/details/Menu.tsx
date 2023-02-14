import { FC, useEffect } from 'react'
import toast from 'react-hot-toast';
import { Link, useNavigate } from "react-router-dom";
import { deleteMeeting } from './core/_requests';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { MenuComponent } from '../../../../_metronic/assets/ts/components/MenuComponent';

type Props = {
    id: string
}

const Menu: FC<Props> = ({ id }) => {
    const navigate = useNavigate();
    const handleCancelbtn = async (meetingId: string) => {
        await deleteMeeting(meetingId).then((result: any) => {
            toast.success(result.data.data.message)
            setTimeout(() => {
                return navigate('/dashboard')
            }, 1000)
        },(error) => {
            const resMessage =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
                toast.error(resMessage)
        })
        .catch(() => {
            toast.error('Please try after some time...')
        })
    }

    const submit = (meetingId: string) => {
        confirmAlert({
          title: 'Delete Session',
          message: 'Are you sure, you want to delete this session?',
          buttons: [
            {
              label: 'Yes',
              onClick: () => handleCancelbtn(meetingId)
            },
            {
              label: 'No',
            }
          ]
        });
      };

      useEffect(() => {
        MenuComponent.reinitialization()
    })

    return (
        <>
            <div
                className='menu menu-sub menu-sub-dropdown w-100px w-md-100px'
                data-kt-menu='true'
            >
                <div className='menu-item pt-3 px-3'>
                    <Link to={`/dashboard/createmeeting/${id}`} className='menu-link px-3'>
                        Edit
                    </Link>
                </div>
                <div className='separator opacity-75'></div>
                <div className='menu-item pb-3 px-3'>
                    <div onClick={() => submit(id)} className='menu-link px-3'>
                        Delete
                    </div>
                </div>
            </div>
        </>
    )
}

export { Menu }
