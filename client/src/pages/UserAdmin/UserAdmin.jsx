import {Select, Input, Table, Tag, Pagination, Modal, Button} from 'antd';
import {useEffect, useState} from 'react';
import {authApi} from '../../api/authApi';

function UserAdmin() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
        },
        {
            title: 'Quyền hạn',
            dataIndex: 'role',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (status) => {
                let color = (status === 'active' ? 'green' : 'red');
                return <Tag color={color}>{status.toUpperCase()}</Tag>
            }
        },
        {
            title: 'Thao tác',
            dataIndex: 'action',
            render: (_, record) => (
                <div className='flex gap-x-3'>
                    <div>
                        <Button type='default'>Delete</Button>
                    </div>
                    <div className=''>
                        <Button onClick={showModal}>
                            Update
                        </Button>
                        <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText='Update'>
                            <div className='flex flex-col gap-y-4'>
                                <h1 className='text-center text-[1.4rem]'>User informations</h1>
                                <span>User: {record.email}</span>
                                <span>Email: {record.email}</span>
                                <div className='flex flex-col'>
                                    <span>Role</span>
                                    <Select
                                        defaultValue={record.role}
                                        options={[
                                            {
                                                value: 'User',
                                                label: 'User'
                                            },
                                            {
                                                value: 'Admin',
                                                label: 'Admin'
                                            }
                                        ]}
                                    />
                                </div>
                                <div className='flex flex-col mb-[50px]'>
                                    <span>Status</span>
                                    <Select
                                        defaultValue={record.status}
                                        options={[
                                            {
                                                value: 'Active',
                                                label: 'Active'
                                            },
                                            {
                                                value: 'Inactive',
                                                label: 'Inactive'
                                            }
                                        ]}
                                    />
                                </div>
                            </div>
                        </Modal>
                    </div>
                </div>
            )
        },
    ];

    const fetchApi = async (page) => {
        try {
            const userList = await authApi.getAllUser(page, pageSize, 'email');
            setUsers(userList.data);
            setTotalUsers(userList.totalElements);
            setCurrentPage(userList.currentPage);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchApi(currentPage);
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <>
            <div className="px-[20px] py-[50px]">
                <h1 className="text-[1.2rem] font-bold mb-[20px]">Quản lý người dùng</h1>
                <div className='flex items-center justify-between'>
                    <Select
                        defaultValue={'Tất cả'}
                        placeholder=""
                        options={[
                            {
                                value: 'Tất cả',
                                label: 'Tất cả',
                            },
                            {
                                value: 'Admin',
                                label: 'Admin',
                            },
                            {
                                value: 'Người dùng',
                                label: 'Người dùng',
                            },
                        ]}
                        className='w-[120px]'
                    />
                    <div>
                        <Input placeholder="Tìm kiếm người dùng theo email..." className='w-[300px] h-[33px]'/>;
                    </div>
                </div>
                <div className='mt-[30px] mb-[40px]'>
                    <Table columns={columns} dataSource={users} pagination={false}/>
                </div>
                <div className='flex items-center justify-center'>
                    <Pagination current={currentPage} total={totalUsers} pageSize={pageSize}
                                onChange={handlePageChange}/>
                </div>
            </div>
        </>
    );
}

export default UserAdmin;