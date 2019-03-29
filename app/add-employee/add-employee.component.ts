import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {EmployeeService} from '../services/employee.service';
import {DepartmentService} from '../services/department.service';
import {Location} from '@angular/common';
import {Employee} from '../models/Employee';
import {Response} from '../models/Response';
import {Department} from '../models/Department';
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {
  @Output() onChanged = new EventEmitter<boolean>();


  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
  ) {
  }

  employee: Employee;
  department: Department;

  ngOnInit() {
  }

  change(changed:any) {
    this.onChanged.emit(changed);
  }

  addEmployee(newEmployee, departmentName) {
    this.departmentService.getDepartment(departmentName)
      .subscribe((response: Response) => {
        if (response.success) {
          this.department = response.message;
          this.employee = newEmployee;
          this.employee.department_id = this.department.id;
          this.employeeService.addEmployee(this.employee)
            .subscribe((res: Response) => {
              if (res.success) {
                this.change(true);
              }
            });
        }
      });
  }

  cancel() {
    this.change(null);
  }
}
