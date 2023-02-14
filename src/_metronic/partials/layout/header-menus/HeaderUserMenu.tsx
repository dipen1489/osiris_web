/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import {Dispatch, FC, SetStateAction, useState} from 'react'
import {useAuth} from '../../../../app/modules/auth'
import {toAbsoluteUrl} from '../../../helpers'
import {useEffect} from 'react';
import {ProfilePicUpload} from '../../../../app/pages/student/dashboard/core/_requests'
import Compressor from 'compressorjs';
import { imgTobase64String, uint8array } from '../../../../app/modules/helper';
import { toast } from 'react-hot-toast';
import Axios from 'axios'

type Props = {
  setSelectedProfileFile: Dispatch<SetStateAction<any>>;
}

const HeaderUserMenu: React.FC<Props> = ({setSelectedProfileFile}) => {
  const {currentUser, logout} = useAuth()
  const [file, setSelectedFile] = useState({
      image: false,
      imageName: '',
      imgData: {}
  });
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [compressedFile, setCompressedFile] = useState<Uint8Array>();
  const [imgUrl, setImgUrl] = useState<any>(toAbsoluteUrl('/img/blank.svg'));
  const [imgDeleteToken, setImgDeleteToken] = useState<string>();

  // const arrayBuffer = currentUser?.profilePic ? currentUser.profilePic.data.data : [] as ArrayLike<number> | ArrayBuffer
  // const base64String = imgTobase64String(uint8array(arrayBuffer))

  useEffect(() => {
    if(localStorage.getItem('profile') !== undefined && localStorage.getItem('profile') !== null) {
      const profile = localStorage.getItem('profile')
      setImgUrl(profile)
    }
    else if(currentUser?.profilePic){
      setImgUrl(currentUser?.profilePic)
      localStorage.setItem('profile', currentUser?.profilePic)
      if(currentUser?.profilePic_delete_token)
        localStorage.setItem('profile_dt', currentUser?.profilePic_delete_token)
    }
  }, []);

  const uploadImage = (formData: any) => {
      const uninterceptedAxiosInstance = Axios.create();
      uninterceptedAxiosInstance.post("https://api.cloudinary.com/v1_1/dxva2eqvo/image/upload", formData)
      .then((response) => {
        setImgUrl(response.data.url)
        setImgDeleteToken(response.data.delete_token)
        setIsSuccess(true)
        localStorage.setItem('updata', JSON.stringify(response))
        localStorage.setItem('profile', response.data.url)
        localStorage.setItem('profile_dt', response.data.delete_token)
        toast.success('Profile Image Upload Successfully')
      },
      (error) => {
        const resMessage =
        (error.response && error.response.data && (error.response.data.message || error.response.data.error.message)) ||
        (error.response.data.message || error.response.data.error.message) ||
            error.toString();
        toast.error(resMessage)
        setIsSuccess(false)
      });
  };

  const deleteImage = () =>{
    const token = localStorage.getItem('profile_dt')
    if(token !== null){
      const formData = new FormData()
      formData.append("token", token);

      const uninterceptedAxiosInstance = Axios.create();
      uninterceptedAxiosInstance.post("https://api.cloudinary.com/v1_1/dxva2eqvo/delete_by_token", formData)
      .then(result =>{
        // console.log('result : ',result);
      })
      .catch(error =>{
        // console.log('error : ',error);
      })
    }
  }

  async function fetchData() {
    // You can await here
    if(compressedFile !== undefined && isSuccess) {
      try {
        // await ProfilePicUpload({image: {name: file.imageName, data: Object.values(compressedFile)}}).then(
          await ProfilePicUpload({image: {name: imgUrl, delete_token: imgDeleteToken}}).then(
          (response) => {
            setIsSuccess(false)
            setSelectedProfileFile(file)
            // toast.success('Profile Image Upload Successfully')
          },
          (error) => {
            const resMessage =
            (error.response && error.response.data && (error.response.data.message || error.response.data.error.message)) ||
            (error.response.data.message || error.response.data.error.message) ||
                error.toString();
            toast.error(resMessage)
          });
      } catch (error) {
        toast.error('Please try after some time')
      }
    }
  }

  useEffect(() => {
    // if(compressedFile !== undefined && isSuccess) {
    //   fetchData()
    // } compressedFile, file.imageName, 
    if(isSuccess) {
      fetchData()
    }
  }, [isSuccess]);

  return (
    <div
      className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px'
      data-kt-menu="true"
      data-popper-placement="bottom-start"
    >
      <div className='menu-item px-3'>
        <div className='menu-content d-flex align-items-center px-3'>
          <div className='symbol symbol-50px me-5'>

          <img src={imgUrl} alt='LOGO' />

          {/* {file && file.image ? 
                    (<img src={`${file.imgData}`} alt='LOGO' />) : 
                    base64String ? (<img alt='Logo' src={`data:image/png;base64,${base64String}`} />) : 
                    (<img src={toAbsoluteUrl('/img/blank.png')} alt='LOGO' />)} */}
        </div>

          <div className='d-flex flex-column'>
            <div className='fw-bolder d-flex align-items-center fs-5'>
              {currentUser?.firstname} {currentUser?.lastName}
            </div>
            <a href='#' className='fw-bold text-muted text-hover-primary fs-7'>
              {currentUser?.email}
            </a>
          </div>
        </div>
      </div>
 
      <div className='separator my-2'></div>

      <div className='menu-item px-5 mb-3'>
          <label className='form-label fs-6'>Select Photo</label>
          <div className=''>
              <div className="image-input image-input-outline" style={{ backgroundImage: '/img/blank.svg' }} data-kt-image-input="true">

                  {/* {file && file.image ? 
                    (<img src={`${file.imgData}`} className="image-input-wrapper w-125px h-125px" alt='LOGO' />) : 
                    base64String ? (<img alt='Logo' src={`data:image/png;base64,${base64String}`} className="image-input-wrapper w-125px h-125px" />) : 
                    (<img src={toAbsoluteUrl('/img/blank.svg')} className="image-input-wrapper w-125px h-125px" alt='LOGO' />)} */}
                    <img src={imgUrl} className="image-input-wrapper w-125px h-125px" alt='LOGO' />
                  <label
                      className="btn btn-icon btn-circle btn-color-muted btn-active-color-primary w-25px h-25px bg-body shadow"
                      data-kt-image-input-action="change"
                      data-bs-toggle="tooltip"
                      data-bs-dismiss="click"
                      title="Change Photo">
                      <i className="bi bi-pencil-fill fs-7"></i>
                      <input
                          type="file"
                          onChange={({ currentTarget }) => {
                              const file = currentTarget.files![0];
                              const reader = new FileReader();
                              
                              new Compressor(file, {
                              quality: 0.8, // 0.6 can also be used, but its not recommended to go below.
                              success: async (compressedResult) => {
                                  try {
                                        const formData = new FormData();
                                        formData.append("file",compressedResult);
                                        formData.append("upload_preset","vl0x6a9w");
                                        formData.append("folder","profile_pic/"); 
                                      if(localStorage.getItem('profile') !== null) {
                                          deleteImage()
                                      }
                                      uploadImage(formData)
                                  } catch (error) {
                                    toast.error('Please try after some time')
                                  }
                                  const ab = await compressedResult.arrayBuffer()
                                  const ui8a = new Uint8Array(ab);
                                  setCompressedFile(ui8a)
                              },
                              });

                              if (file) {
                                  reader.onloadend = () => {
                                      setSelectedFile({ image: true, imageName: file.name, imgData: reader.result! });
                                  };
                                  reader.readAsDataURL(file);
                              }
                          }}
                          accept=".png, .jpg, .jpeg" />
                      <input type="hidden" name="avatar_remove" />
                  </label>
                  <span
                      className="btn btn-icon btn-circle btn-color-muted btn-active-color-primary w-25px h-25px bg-body shadow"
                      data-kt-image-input-action="cancel"
                      data-bs-toggle="tooltip"
                      data-bs-dismiss="click"
                      title="Cancel photo">
                      <i className="bi bi-x fs-2"></i>
                  </span>
              </div>
          </div>
      </div>
      <div className='menu-item px-5'>
        <a onClick={logout} className='menu-link px-5'>
          Sign Out
        </a>
      </div>
    </div>
  )
}

export {HeaderUserMenu}
