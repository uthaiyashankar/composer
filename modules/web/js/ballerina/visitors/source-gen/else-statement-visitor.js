/**
 * Copyright (c) 2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import _ from 'lodash';
import log from 'log';
import AbstractStatementSourceGenVisitor from './abstract-statement-source-gen-visitor';
import StatementVisitorFactory from './statement-visitor-factory';

class ElseStatementVisitor extends AbstractStatementSourceGenVisitor {
    constructor(parent) {
        super(parent);
    }

    canVisitElseStatement(elseStatement) {
        return true;
    }

    beginVisitElseStatement(elseStatement) {
        this.node = elseStatement;
        /**
        * set the configuration start for the if statement definition language construct
        * If we need to add additional parameters which are dynamically added to the configuration start
        * that particular source generation has to be constructed here
        */
        this.appendSource('else' + elseStatement.getWSRegion(1) + '{' + elseStatement.getWSRegion(2));
        this.appendSource((elseStatement.whiteSpace.useDefault) ? this.getIndentation() : '');
        this.indent();
        log.debug('Begin visit Else Statement Definition');
    }

    visitStatement(statement) {
        if(!_.isEqual(this.node, statement)) {
            var statementVisitorFactory = new StatementVisitorFactory();
            var statementVisitor = statementVisitorFactory.getStatementVisitor(statement, this);
            statement.accept(statementVisitor);
        }
    }

    endVisitElseStatement(elseStatement) {
        this.outdent();
        this.appendSource('}' + elseStatement.getWSRegion(3));
        this.getParent().appendSource(this.getGeneratedSource());
        log.debug('End Visit Else Statement Definition');
    }
}

export default ElseStatementVisitor;
