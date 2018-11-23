import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService, AuthenticationService } from '@app/services';
import { v4 as uuid } from 'uuid';
import { IGraduate, IUser } from '../models';

interface IUniversity {
    name: string;
    id: string;
}

interface ILocations {
    name: string;
    id: string;
    state: string;
}

@Component({
    templateUrl: 'register.component.html',
    styleUrls: ['./registerUser.css'],
 })
export class RegisterUserComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    public universities: IUniversity[];
    public degrees: IUniversity[];
    public majors: IUniversity[];
    public locations: ILocations[];
    public employers: IUniversity[];

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }

        this.universities = [
            { name: 'Australian National University', id: 'ANU' },
            { name: 'Bond University', id: 'BU' },
            { name: 'Curtain University', id: 'CUWA' },
            { name: 'Deakin University', id: 'DU' },
            { name: 'Edith Cowan University', id: 'ECU' },
            { name: 'La Trobe University', id: 'LTUS' },
            { name: 'Macquire University', id: 'MUS' },
            { name: 'Monash University', id: 'MUS' },
            { name: 'Murdoch University', id: 'MUR' },
            { name: 'University of Melbourne', id: 'UMEL' },
            { name: 'University of Notre Dame Australia', id: 'UNDA' },
            { name: 'University of Western Australia', id: 'UWA' },
        ];

        this.degrees = [
            { name: 'Bachelor of Arts', id: 'BA' },
            { name: 'Bachelor of Architecture', id: 'Barch' },
            { name: 'Bachelor of Commerce', id: 'BCom' },
            { name: 'Bachelor of Education', id: 'B.Ed' },
            { name: 'Bachelor of Law', id: 'LL.B' },
            { name: 'Bachelor of Science', id: 'B.Sc' },
            { name: 'Bachelor of Medical Sceicne', id: 'B.Med.Sc.' },
        ];

        this.majors = [
            { name: 'Accounting', id: 'ACC' },
            { name: 'Aerospace Systems Engineering ', id: 'ASE' },
            { name: 'Applied Mathematics ', id: 'APM' },
            { name: 'Biochemistry', id: 'BCHEM' },
            { name: 'Chemistry', id: 'CHEM' },
            { name: 'Civil Engineering', id: 'CENG' },
            { name: 'Nursing', id: 'NURS' },
            { name: 'Psychology', id: 'PSY' },
            { name: 'Spanish', id: 'SPA' },
            { name: 'Statistics', id: 'STAT' },
            { name: 'Sport Studies', id: 'SPSC' },
        ];

        this.locations = [
            { name: 'Canberra', id: 'CACT', state: 'ACT' },
            { name: 'Sydney', id: 'SNSW', state: 'NSW' },
            { name: 'Melbourn', id: 'MVIC', state: 'VIC' },
            { name: 'Brisbane', id: 'BQLD', state: 'QLD' },
            { name: 'Perth', id: 'PWA', state: 'WA' },
            { name: 'Adelaide', id: 'ASA', state: 'SA' },
            { name: 'Hobart', id: 'HTAS', state: 'TAS' },
            { name: 'Darwin', id: 'DNT', state: 'NT' },
        ];

        this.employers = [
            { name: 'Google', id: 'alphabet'},
            { name: 'Apple', id: 'appl'},
            { name: 'Deloitte', id: 'delo'},
            { name: 'CSIRO', id: 'csiro'},
            { name: 'PwC', id: 'pwc'},
            { name: 'KPMG', id: 'kpmg'},
            { name: 'EY', id: 'ey'},
            { name: 'Microsoft', id: 'micro'},
            { name: 'Qantas', id: 'quantas'},
            { name: 'Commonwealth Bank', id: 'cbank'},
            { name: 'Australian Federal Police', id: 'afp'},
            { name: 'BHP', id: 'bhp'},
            { name: 'ANZ', id: 'anz'},
            { name: 'IBM', id: 'ibm'},
            { name: 'J.P.Morgan', id: 'jpmorg'},
            { name: 'Nestle', id: 'nest'},
            { name: 'Telstra', id: 'telstra'},
            { name: 'Rio Tinto', id: 'rio'},
            { name: 'NAB', id: 'nab'}
        ];
    }

    ngOnInit() {
        // TODO add email validator

        const locationChecks = {};
        this.locations.forEach(location => {
            const name = location.name;
            locationChecks[name] = [''];
        });

        const employerChecks = {};
        this.employers.forEach(e => {
            const id = e.id;
            employerChecks[id] = [''];
        });

        this.registerForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]],
            university: [''],
            degree: [''],
            major: [''],
            gpa: [''],
            ...locationChecks,
            ...employerChecks,
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        const locs = [];
        this.locations.forEach(l => {
            if (this.registerForm.get(l.name).value === true) {
                locs.push(l.id);
            }
        });

        const emps = [];
        this.employers.forEach(e => {
            if (this.registerForm.get(e.id).value === true) {
                emps.push(e.id);
            }
        });

        const user: IGraduate = {
            id: uuid(),
            firstName: this.registerForm.get('firstName').value,
            lastName: this.registerForm.get('lastName').value,
            email: this.registerForm.get('email').value,
            password: this.registerForm.get('password').value,
            university: this.registerForm.get('university').value,
            degree: this.registerForm.get('degree').value,
            major: this.registerForm.get('major').value,
            gpa: this.registerForm.get('gpa').value,
            employers: emps,
            locations: locs,
        };

        console.log(user);

        this.loading = true;
        this.userService.registerGraduate(user)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Registration successful', true);
                    this.router.navigate(['/login']);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}
