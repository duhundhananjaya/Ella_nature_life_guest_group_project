import React from 'react'
import { Link } from 'react-router';

const Unauthorize = () => {
  return (
    <div>
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-6">
                    <div class="text-center mt-4">
                        <h1 class="display-1">401</h1>
                        <p class="lead">Unauthorized</p>
                        <p>Access to this resource is denied.</p>
                        <Link to="/">
                            <i class="fas fa-arrow-left me-1"></i>
                            Return to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Unauthorize;
