import React, { useState, useEffect } from 'react';
import { Tabs, Card, Table, Button, message, Spin, Typography, Tag, Space, Popconfirm, Form, Input, DatePicker, Modal, Row, Col } from 'antd';
import { UserOutlined, CalendarOutlined, PlusOutlined, DeleteOutlined, EditOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { taskAPI, userAPI } from '../services/apiService';
import { jwtDecode } from 'jwt-decode';
import moment from 'moment';
import ChangePasswordModal from './ChangePasswordModal';
import TaskFilter from './TaskFilter';

const { Title, Text } = Typography;

// Styled Components
const DashboardContainer = styled.div`
  padding: 24px;
`;

const DashboardHeader = styled.div`
  margin-bottom: 24px;
`;

const MainTitle = styled(Title)`
  color: #001529;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const WelcomeText = styled(Text)`
  color: #666;
  font-size: 16px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const UserInfoContainer = styled.div`
  padding: 24px;
`;

const UserCard = styled(Card)`
  max-width: 600px;
  
  .ant-card-head {
    background: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
  }
`;

const UserInfoItem = styled.div`
  margin-bottom: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const UserLabel = styled(Text)`
  font-weight: 600;
  color: #001529;
  margin-right: 8px;
`;

const UserValue = styled(Text)`
  color: #333;
`;

const TasksContainer = styled.div`
  padding: 24px;
`;

const TasksHeader = styled.div`
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TasksTitle = styled(Title)`
  color: #001529;
  margin: 0;
`;

const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    background: #f8f9fa;
    font-weight: 600;
    color: #001529;
  }
  
  .ant-table-tbody > tr:hover > td {
    background: #f0f8ff;
  }
`;

const TaskNameText = styled(Text)`
  font-weight: 600;
  color: #001529;
`;

const StyledModal = styled(Modal)`
  .ant-modal-header {
    background: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
  }
  
  .ant-modal-title {
    color: #001529;
    font-weight: 600;
  }
`;

const FormContainer = styled.div`
  padding: 20px 0;
`;

const ButtonGroup = styled(Space)`
  width: 100%;
  justify-content: flex-end;
`;

const UserActionButtons = styled(Space)`
  margin-top: 16px;
`;

const FilterContainer = styled.div`
  margin-bottom: 24px;
`;

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [todaysTasks, setTodaysTasks] = useState([]);
  const [displayedTasks, setDisplayedTasks] = useState([]);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [form] = Form.useForm();
  const [updateForm] = Form.useForm();
  const navigate = useNavigate();

  // Extract user info from JWT token
  const getUserInfoFromToken = () => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        navigate('/login');
        return null;
      }

      const decodedToken = jwtDecode(token);
      return {
        email: decodedToken.sub,
        name: decodedToken.name || 'User',
        exp: decodedToken.exp
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      localStorage.removeItem('jwtToken');
      navigate('/login');
      return null;
    }
  };

  // Check if token is expired
  const isTokenExpired = (exp) => {
    const currentTime = Date.now() / 1000;
    return exp < currentTime;
  };

  // Load user tasks
  const loadTasks = async () => {
    setLoading(true);
    try {
      const [allTasksResponse, todaysTasksResponse] = await Promise.all([
        taskAPI.getAllTasks(),
        taskAPI.getTodaysTasks()
      ]);
      
      setTasks(allTasksResponse.data);
      setTodaysTasks(todaysTasksResponse.data);
      
      // Set displayed tasks based on current filter
      if (currentFilter === 'today') {
        setDisplayedTasks(todaysTasksResponse.data);
      } else {
        setDisplayedTasks(allTasksResponse.data);
      }
    } catch (error) {
      message.error('Failed to load tasks');
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter change
  const handleFilterChange = (filterType) => {
    setCurrentFilter(filterType);
    if (filterType === 'today') {
      setDisplayedTasks(todaysTasks);
    } else {
      setDisplayedTasks(tasks);
    }
  };

  // Create new task
  const createTask = async (values) => {
    try {
      const taskData = {
        taskName: values.taskName,
        dueDate: values.dueDate.format('YYYY-MM-DDTHH:mm:ss'),
        email: userInfo.email
      };

      await taskAPI.createTask(taskData);
      message.success('Task created successfully!');
      setIsModalVisible(false);
      form.resetFields();
      loadTasks();
    } catch (error) {
      message.error('Failed to create task');
      console.error('Error creating task:', error);
    }
  };

  // Update task
  const updateTask = async (values) => {
    try {
      const updateData = {
        taskName: values.taskName,
        dueDate: values.dueDate ? values.dueDate.format('YYYY-MM-DDTHH:mm:ss') : null
      };

      await taskAPI.updateTask(selectedTask.taskId, updateData);
      message.success('Task updated successfully!');
      setIsUpdateModalVisible(false);
      setSelectedTask(null);
      updateForm.resetFields();
      loadTasks();
    } catch (error) {
      message.error('Failed to update task');
      console.error('Error updating task:', error);
    }
  };

  // Delete task
  const deleteTask = async (taskId) => {
    try {
      await taskAPI.deleteTask(taskId);
      message.success('Task deleted successfully!');
      loadTasks();
    } catch (error) {
      message.error('Failed to delete task');
      console.error('Error deleting task:', error);
    }
  };

  // Open update modal
  const openUpdateModal = (task) => {
    setSelectedTask(task);
    updateForm.setFieldsValue({
      taskName: task.taskName,
      dueDate: task.dueDate ? moment(task.dueDate) : null
    });
    setIsUpdateModalVisible(true);
  };

  // Close update modal
  const closeUpdateModal = () => {
    setIsUpdateModalVisible(false);
    setSelectedTask(null);
    updateForm.resetFields();
  };

  // Check if task is due today
  const isDueToday = (dueDate) => {
    const today = moment().startOf('day');
    const due = moment(dueDate).startOf('day');
    return due.isSame(today);
  };

  // Check if task is overdue
  const isOverdue = (dueDate) => {
    const today = moment().startOf('day');
    const due = moment(dueDate).startOf('day');
    return due.isBefore(today);
  };

  // Handle change password success
  const handlePasswordChangeSuccess = () => {
    setIsPasswordModalVisible(false);
    message.success('Password changed successfully! Please login again for security.');
    setTimeout(() => {
      handleLogout();
    }, 2000);
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    message.success('Logged out successfully');
    navigate('/login');
  };

  useEffect(() => {
    const user = getUserInfoFromToken();
    if (user) {
      if (isTokenExpired(user.exp)) {
        message.error('Session expired. Please login again.');
        localStorage.removeItem('jwtToken');
        navigate('/login');
        return;
      }
      setUserInfo(user);
      loadTasks();
    }
  }, [navigate]);

  // Update displayed tasks when tasks or filter changes
  useEffect(() => {
    handleFilterChange(currentFilter);
  }, [tasks, todaysTasks]);

  // Table columns for tasks
  const columns = [
    {
      title: 'Task Name',
      dataIndex: 'taskName',
      key: 'taskName',
      render: (text) => <TaskNameText>{text}</TaskNameText>
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date) => {
        const formattedDate = moment(date).format('YYYY-MM-DD HH:mm');
        let color = 'default';
        if (isOverdue(date)) color = 'red';
        else if (isDueToday(date)) color = 'orange';
        else color = 'green';
        
        return <Tag color={color}>{formattedDate}</Tag>;
      }
    },
    {
      title: 'Last Updated',
      dataIndex: 'lastUpDate',
      key: 'lastUpDate',
      render: (date) => date ? moment(date).format('YYYY-MM-DD HH:mm') : 'N/A'
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        if (isOverdue(record.dueDate)) {
          return <Tag color="red">Overdue</Tag>;
        } else if (isDueToday(record.dueDate)) {
          return <Tag color="orange">Due Today</Tag>;
        } else {
          return <Tag color="green">Upcoming</Tag>;
        }
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => openUpdateModal(record)}
            title="Edit Task"
          />
          <Popconfirm
            title="Are you sure you want to delete this task?"
            onConfirm={() => deleteTask(record.taskId)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} title="Delete Task" />
          </Popconfirm>
        </Space>
      )
    }
  ];

  // User Info Tab Content
  const userInfoContent = (
    <UserInfoContainer>
      <UserCard 
        title={
          <Space>
            <UserOutlined />
            <span>User Information</span>
          </Space>
        }
        extra={
          <Button type="primary" danger onClick={handleLogout}>
            Logout
          </Button>
        }
      >
        <UserInfoItem>
          <UserLabel>Name: </UserLabel>
          <UserValue>{userInfo?.name || 'N/A'}</UserValue>
        </UserInfoItem>
        <UserInfoItem>
          <UserLabel>Email: </UserLabel>
          <UserValue>{userInfo?.email}</UserValue>
        </UserInfoItem>
        <UserInfoItem>
          <UserLabel>Login Status: </UserLabel>
          <Tag color="green">Active</Tag>
        </UserInfoItem>
        <UserInfoItem>
          <UserLabel>Session Expires: </UserLabel>
          <UserValue>{userInfo?.exp ? moment(userInfo.exp * 1000).format('YYYY-MM-DD HH:mm:ss') : 'N/A'}</UserValue>
        </UserInfoItem>
        
        <UserActionButtons>
          <Button 
            type="default" 
            icon={<LockOutlined />}
            onClick={() => setIsPasswordModalVisible(true)}
          >
            Change Password
          </Button>
        </UserActionButtons>
      </UserCard>
    </UserInfoContainer>
  );

  // Tasks Tab Content
  const tasksContent = (
    <TasksContainer>
      <TasksHeader>
        <TasksTitle level={4}>
          <CalendarOutlined /> My Tasks
        </TasksTitle>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Add New Task
        </Button>
      </TasksHeader>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={6} lg={6}>
          <FilterContainer>
            <TaskFilter
              onFilterChange={handleFilterChange}
              todaysTaskCount={todaysTasks.length}
              allTaskCount={tasks.length}
              showTodaysOnly={currentFilter === 'today'}
            />
          </FilterContainer>
        </Col>
        
        <Col xs={24} sm={24} md={18} lg={18}>
          <Spin spinning={loading}>
            <StyledTable 
              columns={columns} 
              dataSource={displayedTasks} 
              rowKey="taskId"
              pagination={false}
              locale={{ emptyText: currentFilter === 'today' ? 'No tasks due today' : 'No tasks found' }}
            />
          </Spin>
        </Col>
      </Row>

      {/* Add Task Modal */}
      <StyledModal
        title="Add New Task"
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <FormContainer>
          <Form
            form={form}
            layout="vertical"
            onFinish={createTask}
          >
            <Form.Item
              name="taskName"
              label="Task Name"
              rules={[{ required: true, message: 'Please enter task name' }]}
            >
              <Input placeholder="Enter task name" />
            </Form.Item>
            
            <Form.Item
              name="dueDate"
              label="Due Date"
              rules={[{ required: true, message: 'Please select due date' }]}
            >
              <DatePicker 
                showTime 
                format="YYYY-MM-DD HH:mm"
                placeholder="Select due date and time"
                style={{ width: '100%' }}
              />
            </Form.Item>
            
            <Form.Item>
              <ButtonGroup>
                <Button 
                  onClick={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                  }}
                >
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  Create Task
                </Button>
              </ButtonGroup>
            </Form.Item>
          </Form>
        </FormContainer>
      </StyledModal>

      {/* Update Task Modal */}
      <StyledModal
        title="Update Task"
        visible={isUpdateModalVisible}
        onCancel={closeUpdateModal}
        footer={null}
      >
        <FormContainer>
          <Form
            form={updateForm}
            layout="vertical"
            onFinish={updateTask}
          >
            <Form.Item
              name="taskName"
              label="Task Name"
              rules={[{ required: true, message: 'Please enter task name' }]}
            >
              <Input placeholder="Enter task name" />
            </Form.Item>
            
            <Form.Item
              name="dueDate"
              label="Due Date"
              rules={[{ required: true, message: 'Please select due date' }]}
            >
              <DatePicker 
                showTime 
                format="YYYY-MM-DD HH:mm"
                placeholder="Select due date and time"
                style={{ width: '100%' }}
              />
            </Form.Item>
            
            <Form.Item>
              <ButtonGroup>
                <Button onClick={closeUpdateModal}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  Update Task
                </Button>
              </ButtonGroup>
            </Form.Item>
          </Form>
        </FormContainer>
      </StyledModal>

      {/* Change Password Modal */}
      <ChangePasswordModal
        visible={isPasswordModalVisible}
        onCancel={() => setIsPasswordModalVisible(false)}
        onSuccess={handlePasswordChangeSuccess}
      />
    </TasksContainer>
  );

  if (!userInfo) {
    return (
      <LoadingContainer>
        <Spin size="large" />
      </LoadingContainer>
    );
  }

  return (
    <DashboardContainer>
      <DashboardHeader>
        <MainTitle level={2}>Task Management Dashboard</MainTitle>
        <WelcomeText type="secondary">Welcome back, {userInfo.name}!</WelcomeText>
      </DashboardHeader>
      
      <Tabs
        type="card"
        items={[
          {
            key: '1',
            label: 'User Information',
            children: userInfoContent,
            icon: <UserOutlined />
          },
          {
            key: '2',
            label: 'My Tasks',
            children: tasksContent,
            icon: <CalendarOutlined />
          }
        ]}
      />
    </DashboardContainer>
  );
};

export default Dashboard;