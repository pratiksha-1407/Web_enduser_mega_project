import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { theme } from '../global/theme';
import { textStyles } from '../global/textStyles';

const Employee = () => {
  const { user, logout } = useAuth();
  
  const [selectedBranch, setSelectedBranch] = useState('All Branches');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');

  // Mock data for branches
  const branches = [
    {
      name: "Pune Branch",
      district: "Pune",
      employees: 28,
      manager: "Rajesh Kumar",
      address: "Hadapsar, Pune",
      performance: 4.6,
    },
    {
      name: "Mumbai Branch",
      district: "Mumbai",
      employees: 35,
      manager: "Priya Sharma",
      address: "Andheri East, Mumbai",
      performance: 4.8,
    },
  ];

  // Mock data for employees
  const employees = [
    {
      id: "EMP-PN-001",
      name: "Rajesh Kumar",
      position: "Branch Manager",
      department: "Management",
      branch: "Pune Branch",
      district: "Pune",
      salary: 75000,
      status: "Active",
      performance: 4.8,
    },
    {
      id: "EMP-MB-001",
      name: "Priya Sharma",
      position: "Branch Manager",
      department: "Management",
      branch: "Mumbai Branch",
      district: "Mumbai",
      salary: 80000,
      status: "Active",
      performance: 4.9,
    },
  ];

  // Filter employees based on selections
  const filteredEmployees = employees.filter(employee => {
    const branchMatch = selectedBranch === "All Branches" || employee.branch === selectedBranch;
    const deptMatch = selectedDepartment === "All Departments" || employee.department === selectedDepartment;
    return branchMatch && deptMatch;
  });

  return (
    <div style={{ backgroundColor: theme.colors.background, minHeight: '100vh' }}>
      {/* App Bar */}
      <div style={{
        backgroundColor: theme.colors.primaryBlue,
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{
            color: theme.colors.white,
            fontSize: '20px',
            fontWeight: 'bold',
          }}>
            Employee Management
          </span>
        </div>
        <button 
          onClick={logout}
          style={{
            backgroundColor: theme.colors.white,
            color: theme.colors.primaryBlue,
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}>
          Logout
        </button>
      </div>

      <div style={{ padding: '16px' }}>
        {/* Branch Overview */}
        <div style={{
          backgroundColor: theme.colors.white,
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px',
          boxShadow: `0 4px 10px ${theme.colors.shadow}`,
        }}>
          <h2 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 'bold', color: theme.colors.primaryText }}>
            Branch Overview
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
          }}>
            {branches.map((branch, index) => (
              <div 
                key={index}
                style={{
                  backgroundColor: theme.colors.softGreyBg,
                  borderRadius: '12px',
                  padding: '12px',
                  border: `1px solid ${theme.colors.borderGrey}`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div>
                    <div style={{ 
                      fontSize: '14px', 
                      fontWeight: 'bold', 
                      color: theme.colors.primaryBlue,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {branch.name.replace(' Branch', '')}
                    </div>
                    <div style={{ fontSize: '10px', color: theme.colors.secondaryText }}>
                      {branch.district}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <span style={{ fontSize: '12px', color: theme.colors.ratingAmber }}>★</span>
                    <span style={{ fontSize: '11px', color: theme.colors.successGreen, fontWeight: 'bold' }}>
                      {branch.performance}
                    </span>
                  </div>
                </div>
                
                <div style={{ marginTop: '5px' }}>
                  <div style={{ fontSize: '10px', color: theme.colors.secondaryText, fontWeight: '500' }}>
                    Manager: {branch.manager}
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '7px' }}>
                  <span style={{ fontSize: '10px', color: theme.colors.textGrey }}>📍</span>
                  <span style={{ fontSize: '9px', color: theme.colors.textGrey, marginLeft: '4px' }}>
                    {branch.address}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div style={{
          backgroundColor: theme.colors.white,
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px',
          boxShadow: `0 4px 10px ${theme.colors.shadow}`,
        }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '4px', 
                fontSize: '12px', 
                color: theme.colors.textGrey,
                fontWeight: '500'
              }}>
                Branch
              </label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: `1px solid ${theme.colors.borderGrey}`,
                  backgroundColor: theme.colors.cardBg,
                  fontSize: '14px',
                }}
              >
                <option value="All Branches">All Branches</option>
                <option value="Pune Branch">Pune Branch</option>
                <option value="Mumbai Branch">Mumbai Branch</option>
              </select>
            </div>
            
            <div style={{ flex: 1 }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '4px', 
                fontSize: '12px', 
                color: theme.colors.textGrey,
                fontWeight: '500'
              }}>
                Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: `1px solid ${theme.colors.borderGrey}`,
                  backgroundColor: theme.colors.cardBg,
                  fontSize: '14px',
                }}
              >
                <option value="All Departments">All Departments</option>
                <option value="Marketing">Marketing</option>
                <option value="Production">Production</option>
              </select>
            </div>
          </div>
        </div>

        {/* Employee List */}
        <div style={{
          backgroundColor: theme.colors.white,
          borderRadius: '12px',
          padding: '16px',
          boxShadow: `0 4px 10px ${theme.colors.shadow}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h2 style={{ margin: '0', fontSize: '16px', fontWeight: 'bold', color: theme.colors.primaryText }}>
              Employees ({filteredEmployees.length})
            </h2>
            <button style={{
              color: theme.colors.primaryBlue,
              fontSize: '12px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
            }}>
              View All
            </button>
          </div>
          
          <div>
            {filteredEmployees.map((employee, index) => (
              <div 
                key={index}
                style={{
                  backgroundColor: theme.colors.softGreyBg,
                  borderRadius: '8px',
                  padding: '12px',
                  border: `1px solid ${theme.colors.borderGrey}`,
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <div style={{
                  backgroundColor: theme.colors.lightBlue,
                  borderRadius: '50%',
                  padding: '8px',
                  marginRight: '12px',
                }}>
                  <span style={{ color: theme.colors.primaryBlue, fontSize: '16px' }}>👤</span>
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontSize: '14px', 
                    fontWeight: 'bold', 
                    color: theme.colors.primaryText,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {employee.name}
                  </div>
                  <div style={{ 
                    fontSize: '11px', 
                    color: theme.colors.secondaryText,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {employee.position} • {employee.department}
                  </div>
                  <div style={{ 
                    fontSize: '10px', 
                    color: theme.colors.textGrey,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {employee.branch} • {employee.district}
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', color: theme.colors.ratingAmber }}>★</span>
                    <span style={{ fontSize: '12px', fontWeight: 'bold' }}>
                      {employee.performance}
                    </span>
                  </div>
                  <div style={{ 
                    fontSize: '11px', 
                    color: theme.colors.successGreen,
                    fontWeight: '500',
                  }}>
                    ₹{(employee.salary / 1000).toFixed(0)}K
                  </div>
                  <div style={{
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: employee.status === 'Active' ? theme.colors.successLight : theme.colors.textLightGrey,
                    color: employee.status === 'Active' ? theme.colors.successGreen : theme.colors.mutedText,
                    fontSize: '9px',
                    fontWeight: 'bold',
                    marginTop: '4px',
                  }}>
                    {employee.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Employee;