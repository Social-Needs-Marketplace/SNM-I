import React from 'react';
import {Switch} from 'react-router';
import {Route} from 'react-router-dom';

// components
import Landing from './components/Landing';
import InformSuccessPage from "./components/InformSuccessPage";
import Login from './components/Login';
import LoginPane from './components/LoginPane';
import Dashboard from './components/Dashboard';
import Clients from './components/Clients';
import Client from './components/clients/Client';
import ClientForm from './components/clients/ClientForm'
import Users from './components/Users';
import User from './components/users/User';
import UserForm from './components/users/UserForm'
import UserInvite from './components/users/UserInvite'
import ResetPassword from './components/users/UserResetPassword'
import EmailConfirm from './components/emailConfirm'
import UserProfile from './components/Profile'
import UpdateUserProfile from './components/users/EditProfile'
import NeedForm from './components/client_needs/NeedForm'
import Need from './components/client_needs/Need'
import PrivateRoute from './components/routes/PrivateRoute'
import AdminRoute from './components/routes/AdminRoute'
import Providers from './components/Providers';
import AddServicePrompt from './components/providers/AddServicePrompt'
import ProviderForm from './components/providers/ProviderForm'
import ProviderProfile from './components/providers/ProviderProfile'
import ProviderRatingForm from './components/providers/ProviderRatingForm.js';
import Services from './components/Services';
import Service from './components/services/Service';
import ServiceForm from './components/services/ServiceForm'
import AdminLogs from './components/AdminLogs';
import Eligibilities from './components/additionalFIelds/Eligibilities';
import ManageFields from './components/settings/ManageFields';
import Questions from './components/additionalFIelds/Questions';
import UserFirstEntry from "./components/users/UserFirstEntry";

const routes = (
  <Switch>
    <Route exact path='/' component={Landing}/>
    <Route path='/success-trans' component={InformSuccessPage}/>
    <Route path='/login' component={Login}/>
    <Route path='/email-confirm' component={EmailConfirm}/>
    <Route path='/login-pane' component={LoginPane}/>
    <PrivateRoute path='/dashboard' component={Dashboard}/>

    <Route path='/verify/:token' component={UserFirstEntry}/>

    <PrivateRoute path='/clients/:id/edit' component={ClientForm}/>
    <PrivateRoute path='/clients/:id/needs/new' component={NeedForm}/>
    <PrivateRoute path='/clients/new' component={ClientForm}/>
    <PrivateRoute path='/clients/:id' component={Client}/>
    <PrivateRoute path='/clients' component={Clients}/>

    <AdminRoute path='/users/:id/edit' component={UserForm}/>
    <AdminRoute path='/users/new' component={UserForm}/>
    <AdminRoute path='/users/invite' component={UserInvite}/>
    <AdminRoute path='/profile/:id/edit' component={UpdateUserProfile}/>
    <AdminRoute path='/profile/:id' component={UserProfile}/>

    <AdminRoute path='/users/reset-password/:id' component={ResetPassword}/>
    <AdminRoute path='/users/:id' component={User}/>
    <AdminRoute path='/users' component={Users}/>
    <AdminRoute path='/admin-logs' component={AdminLogs}/>


    <PrivateRoute path='/needs/:need_id/edit' component={NeedForm}/>
    <PrivateRoute path='/needs/:need_id' component={Need}/>

    <PrivateRoute path='/providers/:id/rate' component={ProviderRatingForm}/>
    <PrivateRoute path='/providers/new/add-service' component={AddServicePrompt}/>
    <PrivateRoute path='/providers/:formType/new' component={ProviderForm}/>
    <PrivateRoute path='/providers/:id/edit/' component={ProviderForm}/>
    <PrivateRoute path='/providers/:id' component={ProviderProfile}/>
    <PrivateRoute path='/providers' component={Providers}/>

    <PrivateRoute path='/services/:id/edit' component={ServiceForm}/>
    <PrivateRoute path='/services/new' component={ServiceForm}/>
    <PrivateRoute path='/services/:id' component={Service}/>
    <PrivateRoute path='/services' component={Services}/>

    <PrivateRoute path='/eligibility-criteria' component={Eligibilities}/>

    <PrivateRoute path='/questions' component={Questions}/>

    <AdminRoute path='/settings/manage-fields' component={ManageFields}/>
  </Switch>
);

export default routes;
