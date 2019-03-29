import {Component, OnInit} from '@angular/core';
import {EmployeeService} from '../services/employee.service';
import {Employee} from '../models/Employee';
import {Response} from '../models/Response';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {
  isAddEmployee: boolean = false;
  isEditEmployee: boolean = false;
  p: number = 1;
  key: string = 'name';
  reverse: boolean = false;

  constructor(
    private employeeService: EmployeeService
  ) {
  }

  employees: Employee[];

  ngOnInit() {
    this.getEmployees();
  }

  sort(key){
    this.key = key;
    this.reverse = !this.reverse;
  }

  onChangedAdd(changed:any){
    changed==true?this.getEmployees():null;
    this.isAddEmployee = !this.isAddEmployee;
  }
  onChangedEdit(changed:any){
    changed==true?this.getEmployees():null;
    this.isEditEmployee = !this.isEditEmployee;
  }
  getEmployees(): void {
    this.employeeService.getAllEmployees()
      .subscribe((response: Response) => {
        console.log(response);
        if (response.success) {
          this.employees = response.message;
        }
      });
  }

  deleteEmployee(employee): void {
    const id = employee.id;
    this.employeeService.deleteEmployeeById(id)
      .subscribe((response: Response) => {
        if (response.success) {
          this.employees = this.employees.filter(e => e !== employee);
        }
      });
  }

  addEmployee(){
    this.isAddEmployee = !this.isAddEmployee;
  }

  editEmployee(id){
    this.isEditEmployee = !this.isEditEmployee;
    this.employeeService.employeeId = id;

  }

}
