import React from 'react';
import { Router, Switch } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import ExpenseDashBoardPage from '../components/ExpenseDashBoardPage';
import AddExpensePage from '../components/AddExpensePage';
import EditExpensePage from '../components/EditExpensePage';
import NotFoundPage from '../components/NotFoundPage';
import LoginPage from '../components/LoginPage';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

export const history = createHistory();

const AppRouter = () => {
    return (
        <Router history={history}>
            <div>
                <Switch>
                    <PublicRoute path="/" exact={true} component={LoginPage} />
                    <PrivateRoute path="/dashboard" exact={true} component={ExpenseDashBoardPage} />
                    <PrivateRoute path="/create" component={AddExpensePage} />
                    <PrivateRoute path="/edit/:id" component={EditExpensePage} />
                    <PublicRoute component={NotFoundPage} />
                </Switch>
            </div>
        </Router>
    );
}

export default AppRouter;