import React, { useState } from 'react';
import { Card, Checkbox, Space, Typography, Badge } from 'antd';
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';

const { Text } = Typography;

const FilterCard = styled(Card)`
  margin-bottom: 16px;
  border: 1px solid #e8e8e8;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  .ant-card-body {
    padding: 16px;
  }
`;

const FilterTitle = styled(Text)`
  font-weight: 600;
  color: #001529;
  font-size: 16px;
  margin-bottom: 12px;
  display: block;
`;

const FilterOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FilterCheckbox = styled(Checkbox)`
  .ant-checkbox-wrapper {
    display: flex;
    align-items: center;
  }
  
  .ant-checkbox-inner {
    border-color: #1890ff;
  }
  
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #1890ff;
    border-color: #1890ff;
  }
`;

const CheckboxLabel = styled.span`
  color: #333;
  font-weight: 500;
  margin-left: 8px;
`;

const TaskFilter = ({ 
  onFilterChange, 
  todaysTaskCount = 0, 
  allTaskCount = 0, 
  showTodaysOnly = false 
}) => {
  const [selectedFilter, setSelectedFilter] = useState(showTodaysOnly ? 'today' : 'all');

  const handleFilterChange = (filterType) => {
    setSelectedFilter(filterType);
    onFilterChange(filterType);
  };

  return (
    <FilterCard>
      <FilterTitle>
        <CalendarOutlined style={{ marginRight: 8 }} />
        Task Filters
      </FilterTitle>
      
      <FilterOptions>
        <FilterCheckbox
          checked={selectedFilter === 'all'}
          onChange={() => handleFilterChange('all')}
        >
          <Space>
            <CheckboxLabel>All Tasks</CheckboxLabel>
            <Badge count={allTaskCount} style={{ backgroundColor: '#52c41a' }} />
          </Space>
        </FilterCheckbox>
        
        <FilterCheckbox
          checked={selectedFilter === 'today'}
          onChange={() => handleFilterChange('today')}
        >
          <Space>
            <ClockCircleOutlined style={{ color: '#fa8c16' }} />
            <CheckboxLabel>Due Today</CheckboxLabel>
            <Badge count={todaysTaskCount} style={{ backgroundColor: '#fa8c16' }} />
          </Space>
        </FilterCheckbox>
      </FilterOptions>
    </FilterCard>
  );
};

export default TaskFilter;