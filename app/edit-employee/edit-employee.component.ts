import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {EmployeeService} from '../services/employee.service';
import {Employee} from '../models/Employee';
import {Response} from '../models/Response';
import {Department} from '../models/Department';
import {DepartmentService} from '../services/department.service';


@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css']
})
export class EditEmployeeComponent implements OnInit {

  @Output() onChanged = new EventEmitter<boolean>();
  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
  ) {
  }

  employee: Employee;
  newEmployee: Employee;
  department: Department;

  ngOnInit() {
    this.getEmployee(this.employeeService.employeeId);
  }

  getEmployee(id): void {
    this.employeeService.getEmployeeById(id)
      .subscribe((response: Response) => {
        if (response.success) {
          this.employee = response.message;
          this.newEmployee = JSON.parse(JSON.stringify(this.employee));
        }
      });
  }

  change(changed:any) {
    this.onChanged.emit(changed);
  }

  editEmployee(departmentName) {
    this.employee = JSON.parse(JSON.stringify(this.newEmployee));
    this.departmentService.getDepartment(departmentName)
      .subscribe((response: Response) => {
        if (response.success) {
          this.department = response.message;
          this.employee.department_id = this.department.id;
          this.employeeService.updateEmployeeById(this.employee.id, this.employee)
            .subscribe((res: Response) => {
              if (res.success) {
                console.log(res.message);
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
