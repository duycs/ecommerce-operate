import { throwError } from 'rxjs';
import { AlertService } from '../services/alert.service';

export abstract class BaseService {

    constructor() { }

    protected handleError(error: any,) {

        return throwError(error);

        // var applicationError = error?.headers?.get('Application-Error');

        // if (applicationError) {
        //     return throwError(applicationError);
        // }

        // var modelStateErrors!: string | null;

        // console.log("error", error);

        // for (var key in error.error) {
        //     if (error.error[key]) modelStateErrors += error.error[key].description + '\n';
        // }

        // modelStateErrors = modelStateErrors ? modelStateErrors : 'Server error';

        // return throwError(modelStateErrors);
    }
}