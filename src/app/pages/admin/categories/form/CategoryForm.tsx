/* eslint-disable react-hooks/exhaustive-deps */
import {FC, useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useIntl} from 'react-intl'
import {PageTitle} from '../../../../../_metronic/layout/core'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { MeetingAddEditModel, PreferenceCategory } from '../../../instructor/meeting/core/_models'
import { useQueryResponseData, useQueryResponseLoading } from './core/QueryResponseProvider'
import { CategoryRS, ICategory, initialValues } from './core/_models'
import { useFormik } from 'formik'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import { createCategory, updateCategory } from '../../request/_requests'
import Axios from 'axios';
import Compressor from 'compressorjs';
import { Loader } from '../../../component/Loader'
import { toAbsoluteUrl } from '../../../../../_metronic/helpers'

const CategoryForm: FC = () => {
    const intl = useIntl()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const dataModel: MeetingAddEditModel | any  = useQueryResponseData()
    const isLoading = useQueryResponseLoading()
    const [categoryies, setCategoryies] = useState<PreferenceCategory[]>()
    const params = useParams();
    const [data, setData] = useState<ICategory>(initialValues)
    const updateData = (fieldsToUpdate: Partial<ICategory>) => {
        const updatedData = { ...data, ...fieldsToUpdate }
        setData(updatedData)
    }
    const queryid : string | undefined = params.id 

    useEffect(() => {
        if(queryid === undefined){
            updateData({
                type: {
                    parent: true,
                    sub: false
                },
                name: "",
                parentCategoryName: "",
                description: "",
                image: {
                    name: toAbsoluteUrl('/img/blank.svg'),
                    delete_token: ""
                }
            })
        }
    }, [queryid])

    const [subCategoryError, setSubCategoryError] = useState<boolean>(false)

    const categorySchema = Yup.object().shape({
        name: Yup.string()
            .min(3, 'Minimum 3 charaters required')
            .max(50, 'Maximum 50 charaters required')
            .required('Name is required'),
        description: Yup.string()
            .min(0, 'Minimum 0 charaters')
            .max(1000, 'Maximum 1000 charaters')
            .required('Description is required'),
        image: Yup
            .mixed()
            .required('A visual description image is required')
    })

    const formik = useFormik({
        enableReinitialize:true,
        validateOnChange:true,
        validateOnBlur:true,
        initialValues,
        validationSchema: categorySchema,
        onSubmit: async (values, { setStatus, setSubmitting }) => {

            if(data.type.sub && data.parentCategoryName === ""){
                formik.setFieldValue('parentCategoryName', "", true)
                setSubCategoryError(true)
                return false
            }
            else{
                setSubCategoryError(false)
            }
            setSubmitting(true)
            setLoading(true)
            try {
                    if(dataModel.edit === null)
                    {
                        await createCategory(data).then((result: CategoryRS | any) => {
                            if(result.data?.id !== ""){
                                toast.success("Category added Successfully")
                                setSubmitting(false)
                                setLoading(false)
                                setTimeout(() => {
                                    return navigate('/categories')
                                }, 1000)
                            }
                        }).catch((err) => {
                            toast.error("Opps! there is some error please try again...");
                            setSubmitting(false)
                            setLoading(false)
                        });
                    }
                    else{
                        const queryid : string | undefined = params.id 
                        await updateCategory(data, queryid!).then((result: CategoryRS | any) => {
                            if(result.data?.id !== ""){
                                toast.success("Category Updated Successfully")
                                setSubmitting(false)
                                setLoading(false)
                                setTimeout(() => {
                                    return navigate('/categories')
                                }, 1000)
                            }
                        }).catch((err) => {
                            toast.error("Opps! there is some error please try again...");
                            setSubmitting(false)
                            setLoading(false)
                        });
                    } 
            } catch (error) {
                console.error(error)
                setStatus('The instructor save has some error')
                setSubmitting(false)
                setLoading(false)
            }
        },
    })

    const [divClass, setDivClass] = useState<string>("col-lg-12 mb-8")
    const [isParentVisible, setIsParentVisible] = useState<boolean>(false)
    useEffect(() => {
        if(data.type.sub){
            setDivClass("col-lg-6 mb-8")
            setIsParentVisible(true)
        }
        else{
            setDivClass("col-lg-12 mb-8")
            setIsParentVisible(false)
        }
    },[data])

    useEffect(() => {
        if(dataModel.category){
            setCategoryies(dataModel.category.data)
        }
        
        if(dataModel.edit !== null && dataModel.edit && !isLoading){
            const queryid : string | undefined = params.id 
            setLoading(true)
            
            for(let i = 0; i < dataModel.category.data!.length; i++){
                if(queryid === dataModel.category.data![i].id){
                    if(dataModel.category.data![i].parentCategoryName !== null || dataModel.category.data![i].parentCategoryName !== ""){
                        updateData({
                            type: {
                                parent: false,
                                sub: true,
                            },
                        })
                        updateData({ parentCategoryName: dataModel.category.data![i].parentCategoryName })
                    }
                    else{
                        updateData({
                            type: {
                                parent: true,
                                sub: false,
                            },
                        })
                    }
                    updateData({ name: dataModel.category.data![i].name })
                    updateData({ description: dataModel.category.data![i].description })
                    updateData({
                        image: {
                            name: dataModel.category.data![i].image,
                            delete_token: dataModel.category.data![i].image_delete_token,
                        },
                    })
                    formik.setFieldValue('image', dataModel.category.data![i].image, dataModel.category.data![i].image !== "" ? false : true)
                    formik.setFieldValue('parentCategoryName', dataModel.category.data![i].parentCategoryName, (dataModel.category.data![i].parentCategoryName !== "" || dataModel.category.data![i].parentCategoryName !== null) ? false : true)
                    formik.setFieldValue('name', dataModel.category.data![i].name, dataModel.category.data![i].name !== "" ? false : true)
                    formik.setFieldValue('description', dataModel.category.data![i].description, dataModel.category.data![i].description !== "" ? false : true)
                  
                    const editValues = {
                        type: {
                            parent: (dataModel.category.data![i].parentCategoryName === null || dataModel.category.data![i].parentCategoryName === "") ? true : false,
                            sub: (dataModel.category.data![i].parentCategoryName === null || dataModel.category.data![i].parentCategoryName === "") ? false : true,
                        },
                        name: dataModel.category.data![i].name,
                        parentCategoryName: dataModel.category.data![i].parentCategoryName,
                        description: dataModel.category.data![i].description,
                        image: {
                            name: dataModel.category.data![i].image,
                            delete_token: dataModel.category.data![i].image_delete_token,
                        },
                    }
                    
                    setData(editValues)
                    break;
                }
            }

            setLoading(false)
        }
        else if(queryid === undefined){
            setData(initialValues)
        }
    },[!isLoading])

    const [isImgUploading, setIsImgUploading] = useState<boolean>(false);

    const uploadImage = (formData: any) => {
        const uninterceptedAxiosInstance = Axios.create();
        uninterceptedAxiosInstance.post("https://api.cloudinary.com/v1_1/dxva2eqvo/image/upload", formData)
        .then((response) => {
            setIsImgUploading(false)
            updateData({
                image: {
                    name: response.data.url,
                    delete_token: response.data.delete_token,
                },
            })
        //   setImgUrl(response.data.url)
        //   setImgDeleteToken(response.data.delete_token)
        },
        (error) => {
          const resMessage =
          (error.response && error.response.data && (error.response.data.message || error.response.data.error.message)) ||
          (error.response.data.message || error.response.data.error.message) ||
              error.toString();
          toast.error(resMessage)
        });
    };
  
    const deleteImage = () =>{
      if(data.image.delete_token !== ""){
        const formData = new FormData()
        formData.append("token", data.image.delete_token);
  
        const uninterceptedAxiosInstance = Axios.create();
        uninterceptedAxiosInstance.post("https://api.cloudinary.com/v1_1/dxva2eqvo/delete_by_token", formData)
        .then(result =>{
        //   console.log('result : ',result);
        })
        .catch(error =>{
        //   console.log('error : ',error);
        })
      }
    }

return (
  <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({ id: dataModel.edit !== null ? 'MENU.CATEGORYEDIT' : 'MENU.CATEGORYCREATION' })}</PageTitle>
      {
          (queryid !== undefined && isLoading && !loading) ? 
          <Loader classes='image-input-wrapper d-grid align-content-center w-100 h-150px start-0 left-0 top-0' position='inherit' message='Please wait...' addCustomStyles={false} iconWidth={50} /> : 
            <form className='form d-flex flex-center' onSubmit={formik.handleSubmit}>
                <div className='card-body py-10'>
                    {formik.status && (
                        <div className='mb-lg-15 alert alert-danger'>
                            <div className='alert-text font-weight-bold'>{formik.status}</div>
                        </div>
                    )}
                    <div className='row mb-8'>
                        {
                            dataModel.edit === null ? 
                            <div className='col-lg-12 mb-8  d-flex'>
                                <label className='form-check form-check-custom form-check-solid me-10'>
                                    <input
                                        className='form-check-input'
                                        name='type'
                                        type='radio'
                                        defaultChecked={data.type.parent}
                                        onChange={() => {
                                            updateData({
                                                type: {
                                                    parent: true,
                                                    sub: false,
                                                },
                                            })
                                        }}
                                    />
                                    <span className='ps-2 fs-6'>{intl.formatMessage({id: 'ADMIN.CATEGORY.FORM.PARENT'})}</span>
                                </label>
                                <label className='form-check form-check-custom form-check-solid me-5'>
                                    <input
                                        className='form-check-input'
                                        name='type'
                                        type='radio'
                                        defaultChecked={data.type.sub}
                                        onChange={() => {
                                            updateData({
                                                type: {
                                                    parent: false,
                                                    sub: true,
                                                },
                                            })
                                        }}
                                    />
                                    <span className='ps-2 fs-6'>{intl.formatMessage({id: 'ADMIN.CATEGORY.FORM.SUBC'})}</span>
                                </label>
                            </div> : 
                            <div className='col-lg-12 mb-8  d-flex'>
                                <label className='form-check form-check-custom form-check-solid me-10'>
                                    <span className='ps-2 fs-7 text-uppercase fw-semibold categoryEdit p-2'>{intl.formatMessage({id: (data.parentCategoryName === "" || data.parentCategoryName === null) ? 'ADMIN.CATEGORY.FORM.PARENT' : 'ADMIN.CATEGORY.FORM.SUBC'})}</span>
                                </label>
                            </div>
                        }

                        <div className={divClass}>
                            <label className='form-label fs-6'>
                                {intl.formatMessage({id: 'ADMIN.CATEGORY.FORM.NAME'})}
                            </label>
                            <input
                                placeholder={intl.formatMessage({id: 'ADMIN.CATEGORY.FORM.NAME'})}
                                type='text'
                                autoComplete='off'
                                name='name'
                                onChange={(e) => {
                                    formik.setFieldValue('name', e.target.value, e.target.value !== "" ? true : false)
                                    updateData({ name: e.target.value })
                                }}
                                value={data.name}
                                className={clsx(
                                    'form-control rounded-pill form-control-lg border border-1 border-gray-900',
                                    {
                                        'is-invalid': formik.touched.name && formik.errors.name,
                                    },
                                    {
                                        'is-valid': formik.touched.name && !formik.errors.name,
                                    }
                                )}
                            />
                            {formik.touched.name && formik.errors.name && (
                                <div className='fv-plugins-message-container'>
                                    <div className='fv-help-block'>
                                        <span role='alert'>{formik.errors.name}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {isParentVisible && 
                            <div className='col-lg-6 mb-8'>
                                <label className='form-label fs-6'>{intl.formatMessage({id: 'ADMIN.CATEGORY.FORM.SELECTPARENT'})}</label>
                                
                                <select
                                    {...formik.getFieldProps('parentCategoryName')}
                                    className={clsx(
                                        'form-control rounded-pill form-control-lg form-select border border-1 border-gray-900',
                                        {
                                            'is-invalid': formik.touched.parentCategoryName && subCategoryError,
                                        },
                                        {
                                            'is-valid': formik.touched.parentCategoryName && !subCategoryError,
                                        }
                                    )}
                                    value={data.parentCategoryName}
                                    onChange={(e) => {
                                        formik.setFieldValue('parentCategoryName', e.target.value, e.target.value !== "" ? true : false)
                                        updateData({ parentCategoryName: e.target.value })
                                    }}
                                >
                                    <option value=''>Select Category...</option>
                                    { 
                                        !isLoading && categoryies &&
                                        categoryies.length > 0 && 
                                        categoryies.map((element) => {
                                            return <option value={element.name} key={element.id}>{element.name}</option>
                                        })
                                    }
                                </select>

                                {formik.touched.parentCategoryName && subCategoryError && (
                                    <div className='fv-plugins-message-container'>
                                        <div className='fv-help-block'>
                                            <span role='alert'>Please select parent category</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        }
                        
                        <div className='col-lg-4 mb-8 d-flex flex-column'>
                            <label className='form-label fs-6'>{intl.formatMessage({id: 'ADMIN.CATEGORY.FORM.PHOTO'})}</label>
                            <div className="image-input image-input-outline" style={{ backgroundImage: toAbsoluteUrl('/img/blank.svg') }} data-kt-image-input="true">
                                { 
                                    isImgUploading ? 
                                    <Loader classes='image-input-wrapper d-grid align-content-center w-100 h-150px p-4 start-0 left-0 top-0' position='inherit' message='Uploading...' addCustomStyles={false} iconWidth={36} /> :  
                                    (<>
                                        <img src={data.image.name} className="image-input-wrapper w-100 h-150px" style={{ objectFit: 'contain'}} alt='LOGO' />
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
                                                    setIsImgUploading(true)
                                                    new Compressor(file, {
                                                    quality: 0.8, // 0.6 can also be used, but its not recommended to go below.
                                                    success: async (compressedResult) => {
                                                        try {
                                                            const formData = new FormData();
                                                            formData.append("file",compressedResult);
                                                            formData.append("upload_preset","vl0x6a9w");
                                                            formData.append("folder","category/"); 
                                                            if(data.image.delete_token !== "") {
                                                                deleteImage()
                                                            }
                                                            uploadImage(formData)
                                                        } catch (error) {
                                                            setIsImgUploading(false)
                                                            toast.error('Please try after some time')
                                                        }
                                                    },
                                                    });
                    
                                                    if (file) {
                                                        reader.readAsDataURL(file);
                                                        formik.setFieldValue("image.name", file);
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
                                    </>)
                                }
                            
                            </div>
                            {formik.touched.image?.name && formik.errors.image?.name && (
                                <div className='fv-plugins-message-container'>
                                    <div className='fv-help-block'>
                                        <span role='alert'>{formik.errors.image?.name}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className='col-lg-8 mb-8'>
                            <label className='form-label fs-6'>{intl.formatMessage({id: 'ADMIN.CATEGORY.FORM.DESCRIPTION'})}</label>
                            <textarea
                                placeholder={intl.formatMessage({id: 'ADMIN.CATEGORY.FORM.DESCRIPTION'})}
                                name='description'
                                onChange={(e) => {
                                    formik.setFieldValue('description', e.target.value, e.target.value !== "" ? false : true)
                                    updateData({ description: e.target.value })
                                }}
                                value={data.description}
                                rows={6}
                                className={clsx(
                                    'form-control form-control-lg border border-1 border-gray-900',
                                    {
                                        'is-invalid': formik.touched.description && formik.errors.description,
                                    },
                                    {
                                        'is-valid': formik.touched.description && !formik.errors.description,
                                    }
                                )}
                            />
                            {formik.touched.description && formik.errors.description && (
                                <div className='fv-plugins-message-container'>
                                    <div className='fv-help-block'>
                                        <span role='alert'>{formik.errors.description}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='separator separator-dashed my-10'></div>

                    <div className='row'>
                        <div className='col-lg-12 text-end'>
                            <Link to='/categories'>
                                <button
                                    type='button'
                                    className='btn btn-color-gray-600 btn-active-light-primary fw-bolder px-6 py-3 me-3'
                                >
                                    {intl.formatMessage({id: 'ADMIN.INSTRUCTOR.FORM.CANCEL'})}
                                </button>
                            </Link>
                            <button
                                type='submit'
                                className='btn themebtnblue fw-bolder px-6 py-3'
                                style={{ backgroundColor: '#144067', color: '#FFFFFF' }}
                                disabled={formik.isSubmitting || !formik.isValid}
                            >
                                {!loading && <span className='indicator-label'>{intl.formatMessage({id: dataModel.edit !== null ? 'ADMIN.CATEGORY.FORM.UPDATE' : 'ADMIN.CATEGORY.FORM.SAVE'})}</span>}
                                {loading && (
                                    <span className='indicator-progress' style={{ display: 'block' }}> 
                                        Please wait...{' '}
                                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                    {/* end::Form row */}
                </div>
            </form>
      }
  </>
)
}

export {CategoryForm}