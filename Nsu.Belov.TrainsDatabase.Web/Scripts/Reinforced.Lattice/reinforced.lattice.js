var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var ComponentsContainer = (function () {
            function ComponentsContainer() {
            }
            ComponentsContainer.registerComponent = function (key, ctor) {
                this._components[key] = ctor;
            };
            ComponentsContainer.resolveComponent = function (key, args) {
                if (this._components[key] == null || this._components[key] == undefined)
                    throw new Error("Component " + key + " is not registered. Please ensure that you have connected all the additional scripts");
                if (!args)
                    return new (this._components[key]);
                else {
                    var ctor = this._components[key];
                    var boundCtor = Function.prototype.bind.apply(ctor, [null].concat(args));
                    return new boundCtor();
                }
            };
            ComponentsContainer.registerComponentEvents = function (key, eventsManager, masterTable) {
                if (this._components[key] == null || this._components[key] == undefined)
                    throw new Error("Component " + key + " is not registered. Please ensure that you have connected all the additional scripts");
                if (this._components[key].registerEvents && typeof this._components[key].registerEvents === 'function') {
                    this._components[key].registerEvents.call(eventsManager, eventsManager, masterTable);
                }
            };
            ComponentsContainer.registerAllEvents = function (eventsManager, masterTable) {
                for (var key in this._components) {
                    if (this._components[key].registerEvents && typeof this._components[key].registerEvents === 'function') {
                        this._components[key].registerEvents.call(eventsManager, eventsManager, masterTable);
                    }
                }
            };
            ComponentsContainer._components = {};
            return ComponentsContainer;
        }());
        Lattice.ComponentsContainer = ComponentsContainer;
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Templating;
        (function (Templating) {
            var TemplatesExecutor = (function () {
                function TemplatesExecutor(lib, masterTable) {
                    var _this = this;
                    this.ColumnRenderes = {};
                    this.Spaces = {};
                    this._lib = lib;
                    this._master = masterTable;
                    this.CoreTemplateIds = masterTable.Configuration.CoreTemplates;
                    this.cacheColumnRenderers(masterTable.InstanceManager.Columns);
                    this._uiColumns = function () { return _this.Instances.getUiColumns(); };
                    this.Instances = masterTable.InstanceManager;
                    var s = ' ';
                    for (var i = 1; i <= 30; i++) {
                        this.Spaces[i] = s;
                        s += ' ';
                    }
                }
                TemplatesExecutor.prototype.cacheColumnRenderers = function (columns) {
                    for (var key in columns) {
                        if (columns.hasOwnProperty(key)) {
                            var columnConfig = columns[key].Configuration;
                            if (columnConfig.CellRenderingValueFunction) {
                                this.ColumnRenderes[columnConfig.RawColumnName] = columnConfig.CellRenderingValueFunction;
                                continue;
                            }
                            if (columnConfig.CellRenderingTemplateId) {
                                this.ColumnRenderes[columnConfig.RawColumnName] = 'template';
                                continue;
                            }
                            this.ColumnRenderes[columnConfig.RawColumnName] =
                                function (x) { return ((x.Data !== null && x.Data != undefined) ? x.Data : ''); };
                        }
                    }
                    ;
                };
                TemplatesExecutor.prototype.executeLayout = function () {
                    return this.execute(null, this.CoreTemplateIds.Layout);
                };
                TemplatesExecutor.prototype.beginProcess = function () {
                    return new Templating.TemplateProcess(this._uiColumns, this);
                };
                TemplatesExecutor.prototype.endProcess = function (tp) {
                    return {
                        Html: tp.Html,
                        BackbindInfo: tp.BackInfo
                    };
                };
                TemplatesExecutor.prototype.execute = function (data, templateId) {
                    if (!this._lib.Templates.hasOwnProperty(templateId)) {
                        throw new Error("Cannot find template " + templateId);
                    }
                    var tp = new Templating.TemplateProcess(this._uiColumns, this);
                    this._lib.Templates[templateId](data, Reinforced.Lattice.Templating.Driver, tp.w, tp, tp.s);
                    return {
                        Html: tp.Html,
                        BackbindInfo: tp.BackInfo
                    };
                };
                TemplatesExecutor.prototype.nest = function (data, templateId, p) {
                    if (!this._lib.Templates.hasOwnProperty(templateId)) {
                        throw new Error("Cannot find template " + templateId);
                    }
                    this._lib.Templates[templateId](data, Reinforced.Lattice.Templating.Driver, p.w, p, p.s);
                };
                TemplatesExecutor.prototype.hasTemplate = function (templateId) {
                    return this._lib.Templates.hasOwnProperty(templateId);
                };
                TemplatesExecutor.prototype.obtainRowTemplate = function (rw) {
                    if (rw.TemplateIdOverride) {
                        return rw.TemplateIdOverride;
                    }
                    if (this._master.Configuration.TemplateSelector) {
                        var to = this._master.Configuration.TemplateSelector(rw);
                        if (!(!to))
                            rw.TemplateIdOverride = to;
                    }
                    if (rw.TemplateIdOverride) {
                        return rw.TemplateIdOverride;
                    }
                    return this.CoreTemplateIds.RowWrapper;
                };
                TemplatesExecutor.prototype.obtainLineTemplate = function () {
                    return this.CoreTemplateIds.Line;
                };
                TemplatesExecutor.prototype.obtainCellTemplate = function (cell) {
                    if (cell.TemplateIdOverride) {
                        return cell.TemplateIdOverride;
                    }
                    if (cell.Column.Configuration.TemplateSelector) {
                        cell.TemplateIdOverride = cell.Column.Configuration.TemplateSelector(cell);
                    }
                    if (cell.TemplateIdOverride) {
                        return cell.TemplateIdOverride;
                    }
                    return this.CoreTemplateIds.CellWrapper;
                };
                return TemplatesExecutor;
            }());
            Templating.TemplatesExecutor = TemplatesExecutor;
        })(Templating = Lattice.Templating || (Lattice.Templating = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var TableEvent = (function () {
            function TableEvent(masterTable) {
                this._beforeCount = 0;
                this._afterCount = 0;
                this._handlersAfter = {};
                this._handlersBefore = {};
                this._masterTable = masterTable;
            }
            TableEvent.prototype.invokeBefore = function (thisArg, eventArgs) {
                if (this._beforeCount === 0)
                    return;
                var ea = {
                    MasterTable: this._masterTable,
                    EventArgs: eventArgs,
                    EventDirection: Lattice.EventDirection.Before
                };
                var hndlrs = this._handlersBefore;
                var i = 0;
                for (var k in hndlrs) {
                    if (hndlrs.hasOwnProperty(k)) {
                        var kHandlers = hndlrs[k];
                        for (i = 0; i < kHandlers.length; i++) {
                            kHandlers[i].apply(thisArg, [ea]);
                        }
                        i = 0;
                    }
                }
            };
            TableEvent.prototype.invokeAfter = function (thisArg, eventArgs) {
                if (this._afterCount === 0)
                    return;
                var ea = {
                    MasterTable: this._masterTable,
                    EventArgs: eventArgs,
                    EventDirection: Lattice.EventDirection.After
                };
                var hndlrs = this._handlersAfter;
                var i = 0;
                for (var k in hndlrs) {
                    if (hndlrs.hasOwnProperty(k)) {
                        var kHandlers = hndlrs[k];
                        for (i = 0; i < kHandlers.length; i++) {
                            kHandlers[i].apply(thisArg, [ea]);
                        }
                        i = 0;
                    }
                }
            };
            TableEvent.prototype.invoke = function (thisArg, eventArgs) {
                this.invokeAfter(thisArg, eventArgs);
            };
            TableEvent.prototype.subscribeAfter = function (handler, subscriber) {
                if (!this._handlersAfter[subscriber]) {
                    this._handlersAfter[subscriber] = [];
                }
                this._handlersAfter[subscriber].push(handler);
                this._afterCount++;
            };
            TableEvent.prototype.subscribe = function (handler, subscriber) {
                this.subscribeAfter(handler, subscriber);
            };
            TableEvent.prototype.subscribeBefore = function (handler, subscriber) {
                if (!this._handlersBefore[subscriber]) {
                    this._handlersBefore[subscriber] = [];
                }
                this._handlersBefore[subscriber].push(handler);
                this._beforeCount++;
            };
            TableEvent.prototype.unsubscribe = function (subscriber) {
                this.unsubscribeBefore(subscriber);
                this.unsubscribeAfter(subscriber);
            };
            TableEvent.prototype.unsubscribeAfter = function (subscriber) {
                this._handlersAfter[subscriber] = null;
                delete this._handlersAfter[subscriber];
                this._afterCount--;
            };
            TableEvent.prototype.unsubscribeBefore = function (subscriber) {
                this._handlersBefore[subscriber] = null;
                delete this._handlersBefore[subscriber];
                this._beforeCount--;
            };
            return TableEvent;
        }());
        Lattice.TableEvent = TableEvent;
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Services;
        (function (Services) {
            var EventsService = (function () {
                function EventsService(masterTable) {
                    this._masterTable = masterTable;
                    this.QueryGathering = new Lattice.TableEvent(masterTable);
                    this.ClientQueryGathering = new Lattice.TableEvent(masterTable);
                    this.Loading = new Lattice.TableEvent(masterTable);
                    this.LoadingError = new Lattice.TableEvent(masterTable);
                    this.ColumnsCreation = new Lattice.TableEvent(masterTable);
                    this.DataReceived = new Lattice.TableEvent(masterTable);
                    this.LayoutRendered = new Lattice.TableEvent(masterTable);
                    this.ClientDataProcessing = new Lattice.TableEvent(masterTable);
                    this.DataRendered = new Lattice.TableEvent(masterTable);
                    this.DeferredDataReceived = new Lattice.TableEvent(masterTable);
                    this.Adjustment = new Lattice.TableEvent(masterTable);
                    this.Edit = new Lattice.TableEvent(masterTable);
                    this.EditValidationFailed = new Lattice.TableEvent(masterTable);
                    this.SelectionChanged = new Lattice.TableEvent(masterTable);
                    this.PartitionChanged = new Lattice.TableEvent(masterTable);
                    this.Filtered = new Lattice.TableEvent(masterTable);
                    this.Ordered = new Lattice.TableEvent(masterTable);
                    this.Partitioned = new Lattice.TableEvent(masterTable);
                    this.AdjustmentRender = new Lattice.TableEvent(masterTable);
                }
                EventsService.prototype.registerEvent = function (eventName) {
                    this[eventName] = new Lattice.TableEvent(this._masterTable);
                };
                return EventsService;
            }());
            Services.EventsService = EventsService;
        })(Services = Lattice.Services || (Lattice.Services = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Services;
        (function (Services) {
            var EventsDelegatorService = (function () {
                function EventsDelegatorService(locator, bodyElement, layoutElement, rootId, masterTable) {
                    this._outSubscriptions = {};
                    this._previousMousePos = { row: 0, column: 0 };
                    this._domEvents = {};
                    this._outEvents = {};
                    this._cellDomSubscriptions = {};
                    this._rowDomSubscriptions = {};
                    this._directSubscriptions = [];
                    this._destroyCallbacks = [];
                    this._locator = locator;
                    this._bodyElement = bodyElement;
                    this._layoutElement = layoutElement;
                    this._rootId = rootId;
                    this._masterTable = masterTable;
                    this._matches = (function (el) {
                        if (!el)
                            return null;
                        var p = el.prototype;
                        return (p.matches || p['matchesSelector'] || p.webkitMatchesSelector || p['mozMatchesSelector'] || p.msMatchesSelector || p['oMatchesSelector']);
                    }(Element));
                }
                EventsDelegatorService.addHandler = function (element, type, handler, useCapture) {
                    if (useCapture == null)
                        useCapture = false;
                    if (element.addEventListener) {
                        element.addEventListener(type, handler, false);
                    }
                    else if (element['attachEvent']) {
                        element['attachEvent'].call(element, "on" + type, handler);
                    }
                    else {
                        element["on" + type] = handler;
                    }
                };
                EventsDelegatorService.removeHandler = function (element, type, handler, useCapture) {
                    if (useCapture == null)
                        useCapture = false;
                    if (element.removeEventListener) {
                        element.removeEventListener(type, handler, false);
                    }
                    else if (element['detachEvent']) {
                        element['detachEvent'].call(element, "on" + type, handler);
                    }
                    else {
                        element["on" + type] = null;
                    }
                };
                EventsDelegatorService.prototype.traverseAndFire = function (subscriptions, path, args) {
                    if (!subscriptions)
                        return;
                    for (var i = 0; i < subscriptions.length; i++) {
                        if (subscriptions[i].Selector) {
                            for (var j = 0; j < path.length; j++) {
                                if (this._matches.call(path[j], "#" + this._rootId + " " + subscriptions[i].Selector)) {
                                    if (subscriptions[i].filter(args['OriginalEvent'])) {
                                        subscriptions[i].Handler(args);
                                        break;
                                    }
                                }
                                if (args.Stop)
                                    break;
                            }
                        }
                        else {
                            subscriptions[i].Handler(args);
                        }
                        if (args.Stop)
                            break;
                    }
                };
                EventsDelegatorService.prototype.ensureMouseOpSubscriptions = function () {
                    if (this._domEvents.hasOwnProperty('mousemove'))
                        return;
                    var fn = this.onMouseMoveEvent.bind(this);
                    EventsDelegatorService.addHandler(this._bodyElement, 'mousemove', fn);
                    this._domEvents["mousemove"] = fn;
                };
                EventsDelegatorService.prototype.checkMouseEvent = function (eventId) {
                    if (eventId === 'mouseover' || eventId === 'mouseout') {
                        throw Error('Mouseover and mouseout events are not supported. Please use mouseenter and mouseleave events instead');
                    }
                    if (eventId === 'mouseenter' || eventId === 'mouseleave' || eventId === 'mousemove') {
                        this.ensureMouseOpSubscriptions();
                        return true;
                    }
                    return false;
                };
                EventsDelegatorService.prototype.onMouseMoveEvent = function (e) {
                    var t = (e.target || e.srcElement), eventType = e.type;
                    var rowEvents = {
                        'mouseenter': this._rowDomSubscriptions['mouseenter'],
                        'mouseleave': this._rowDomSubscriptions['mouseleave'],
                        'mousemove': this._rowDomSubscriptions['mousemove']
                    };
                    var cellEvents = {
                        'mouseenter': this._cellDomSubscriptions['mouseenter'],
                        'mouseleave': this._cellDomSubscriptions['mouseleave'],
                        'mousemove': this._cellDomSubscriptions['mousemove']
                    };
                    if ((!rowEvents["mouseenter"]) &&
                        (!rowEvents["mouseleave"]) &&
                        (!rowEvents["mousemove"]) &&
                        (!cellEvents["mouseenter"]) &&
                        (!cellEvents["mousemove"]) &&
                        (!cellEvents["mouseleave"]))
                        return;
                    var pathToCell = [];
                    var pathToRow = [];
                    var cellLocation = null, rowIndex = null;
                    while (t !== this._bodyElement) {
                        if (this._locator.isCell(t))
                            cellLocation = Lattice.TrackHelper.getCellLocation(t);
                        if (this._locator.isRow(t))
                            rowIndex = Lattice.TrackHelper.getRowIndex(t);
                        if (cellLocation == null)
                            pathToCell.push(t);
                        if (rowIndex == null)
                            pathToRow.push(t);
                        t = t.parentElement;
                        if (t.parentElement == null) {
                            return;
                        }
                    }
                    if (cellLocation != null) {
                        var cellInArgs = {
                            Master: this._masterTable,
                            OriginalEvent: e,
                            Row: cellLocation.RowIndex,
                            Column: cellLocation.ColumnIndex,
                            Stop: false
                        };
                        if (this._previousMousePos.row !== cellLocation.RowIndex ||
                            this._previousMousePos.column !== cellLocation.ColumnIndex) {
                            var cellOutArgs = {
                                Master: this._masterTable,
                                OriginalEvent: e,
                                Row: this._previousMousePos.row,
                                Column: this._previousMousePos.column,
                                Stop: false
                            };
                            this.traverseAndFire(cellEvents["mouseleave"], pathToCell, cellOutArgs);
                            this.traverseAndFire(cellEvents["mouseenter"], pathToCell, cellInArgs);
                            if (this._previousMousePos.row !== cellLocation.RowIndex) {
                                this.traverseAndFire(rowEvents["mouseleave"], pathToCell, cellOutArgs);
                                this.traverseAndFire(rowEvents["mouseenter"], pathToCell, cellInArgs);
                            }
                            this._previousMousePos.row = cellLocation.RowIndex;
                            this._previousMousePos.column = cellLocation.ColumnIndex;
                        }
                        this.traverseAndFire(cellEvents["mousemove"], pathToCell, cellInArgs);
                        this.traverseAndFire(rowEvents["mousemove"], pathToCell, cellInArgs);
                    }
                    else {
                        if (rowIndex != null) {
                            var rowInArgs = {
                                Master: this._masterTable,
                                OriginalEvent: e,
                                Row: rowIndex,
                                Stop: false
                            };
                            if (this._previousMousePos.row !== rowIndex) {
                                var rowOutArgs = {
                                    Master: this._masterTable,
                                    OriginalEvent: e,
                                    Row: this._previousMousePos.row,
                                    Stop: false
                                };
                                this.traverseAndFire(rowEvents["mouseleave"], pathToCell, rowOutArgs);
                                this.traverseAndFire(rowEvents["mouseenter"], pathToCell, rowInArgs);
                                this._previousMousePos.row = rowIndex;
                            }
                            this.traverseAndFire(rowEvents["mousemove"], pathToCell, rowInArgs);
                        }
                    }
                };
                EventsDelegatorService.prototype.ensureEventSubscription = function (eventId) {
                    if (this.checkMouseEvent(eventId))
                        return;
                    if (this._domEvents.hasOwnProperty(eventId))
                        return;
                    var fn = this.onTableEvent.bind(this);
                    EventsDelegatorService.addHandler(this._bodyElement, eventId, fn);
                    this._domEvents[eventId] = fn;
                };
                EventsDelegatorService.prototype.ensureOutSubscription = function (eventId) {
                    if (this.checkMouseEvent(eventId))
                        return;
                    if (this._outEvents.hasOwnProperty(eventId))
                        return;
                    var fn = this.onOutTableEvent.bind(this);
                    EventsDelegatorService.addHandler(this._layoutElement, eventId, fn);
                    this._outEvents[eventId] = fn;
                };
                EventsDelegatorService.prototype.subscribeCellEvent = function (subscription) {
                    if (!this._cellDomSubscriptions[subscription.EventId]) {
                        this._cellDomSubscriptions[subscription.EventId] = [];
                    }
                    this._cellDomSubscriptions[subscription.EventId].push(subscription);
                    this.ensureEventSubscription(subscription.EventId);
                };
                EventsDelegatorService.prototype.subscribeRowEvent = function (subscription) {
                    if (!this._rowDomSubscriptions[subscription.EventId]) {
                        this._rowDomSubscriptions[subscription.EventId] = [];
                    }
                    this._rowDomSubscriptions[subscription.EventId].push(subscription);
                    this.ensureEventSubscription(subscription.EventId);
                };
                EventsDelegatorService.prototype.subscribeEvent = function (el, event, handler, receiver, eventArguments) {
                    for (var i = 0; i < event.DomEvents.length; i++) {
                        var eventId = event.DomEvents[i];
                        var fn = (function (filter) {
                            return function (e) {
                                if (!filter(e))
                                    return;
                                handler.call(receiver, {
                                    Element: el,
                                    EventObject: e,
                                    Receiver: receiver,
                                    EventArguments: eventArguments
                                });
                            };
                        })(event.Predicate);
                        EventsDelegatorService.addHandler(el, eventId, fn);
                        this._directSubscriptions.push({ Element: el, Handler: fn, EventId: eventId });
                    }
                    el.setAttribute('data-dsub', 'true');
                };
                EventsDelegatorService.prototype.subscribeOutOfElementEvent = function (el, event, handler, receiver, eventArguments) {
                    for (var i = 0; i < event.DomEvents.length; i++) {
                        var eventId = event.DomEvents[i];
                        this.ensureOutSubscription(eventId);
                        if (!this._outSubscriptions.hasOwnProperty(eventId))
                            this._outSubscriptions[eventId] = [];
                        this._outSubscriptions[eventId].push({
                            Element: el,
                            EventArguments: eventArguments,
                            EventObject: null,
                            Receiver: receiver,
                            handler: handler,
                            filter: event.Predicate
                        });
                    }
                    el.setAttribute('data-outsub', 'true');
                };
                EventsDelegatorService.prototype.subscribeDestroy = function (e, callback) {
                    callback.Element = e;
                    e.setAttribute("data-dstrycb", "true");
                    this._destroyCallbacks.push(callback);
                };
                EventsDelegatorService.prototype.onTableEvent = function (e) {
                    var t = (e.target || e.srcElement), eventType = e.type;
                    var forRow = this._rowDomSubscriptions[eventType];
                    var forCell = this._cellDomSubscriptions[eventType];
                    if (!forRow)
                        forRow = [];
                    if (!forCell)
                        forCell = [];
                    if (forRow.length === 0 && forCell.length === 0)
                        return;
                    var pathToCell = [];
                    var pathToRow = [];
                    var cellLocation = null, rowIndex = null;
                    while (t !== this._bodyElement) {
                        if (this._locator.isCell(t))
                            cellLocation = Lattice.TrackHelper.getCellLocation(t);
                        if (this._locator.isRow(t))
                            rowIndex = Lattice.TrackHelper.getRowIndex(t);
                        if (cellLocation == null)
                            pathToCell.push(t);
                        if (rowIndex == null)
                            pathToRow.push(t);
                        t = t.parentElement;
                        if (t.parentElement == null) {
                            return;
                        }
                    }
                    if (cellLocation != null) {
                        var cellArgs = {
                            Master: this._masterTable,
                            OriginalEvent: e,
                            Row: cellLocation.RowIndex,
                            Column: cellLocation.ColumnIndex,
                            Stop: false
                        };
                        this.traverseAndFire(forCell, pathToCell, cellArgs);
                        this.traverseAndFire(forRow, pathToCell, cellArgs);
                    }
                    else {
                        if (rowIndex != null) {
                            var rowArgs = {
                                Master: this._masterTable,
                                OriginalEvent: e,
                                Row: rowIndex,
                                Stop: false
                            };
                            this.traverseAndFire(forRow, pathToRow, rowArgs);
                        }
                    }
                };
                EventsDelegatorService.prototype.onOutTableEvent = function (e) {
                    var subscriptions = this._outSubscriptions[e.type];
                    var target = (e.target || e.srcElement);
                    for (var i = 0; i < subscriptions.length; i++) {
                        var sub = subscriptions[i];
                        var ct = target;
                        var found = false;
                        while (ct !== this._layoutElement) {
                            if (ct === sub.Element) {
                                found = true;
                                break;
                            }
                            ct = ct.parentElement;
                            if (ct.parentElement == null) {
                                return;
                            }
                        }
                        if (!found) {
                            if (sub.filter != null) {
                                if (sub.filter(e)) {
                                    sub.EventObject = e;
                                    sub.handler.apply(sub.Receiver, sub);
                                }
                            }
                            else {
                                sub.EventObject = e;
                                sub.handler.apply(sub.Receiver, sub);
                            }
                        }
                    }
                };
                EventsDelegatorService.prototype.handleElementDestroy = function (e) {
                    var arr = this.collectElementsHavingAttribute(e, 'data-outsub');
                    if (arr.length !== 0) {
                        for (var os in this._outSubscriptions) {
                            var sub = this._outSubscriptions[os];
                            for (var j = 0; j < sub.length; j++) {
                                if (arr.indexOf(sub[j].Element) > -1) {
                                    sub.splice(j, 1);
                                    break;
                                }
                            }
                            if (this._outSubscriptions[os].length === 0) {
                                EventsDelegatorService.removeHandler(this._layoutElement, os, this._outEvents[os]);
                                delete this._outEvents[os];
                            }
                        }
                    }
                    arr = this.collectElementsHavingAttribute(e, 'data-dsub');
                    if (arr.length !== 0) {
                        for (var i = 0; i < this._directSubscriptions.length; i++) {
                            if (arr.indexOf(this._directSubscriptions[i].Element) > -1) {
                                EventsDelegatorService.removeHandler(this._directSubscriptions[i].Element, this._directSubscriptions[i].EventId, this._directSubscriptions[i].Handler);
                            }
                        }
                    }
                    arr = this.collectElementsHavingAttribute(e, 'data-dstrycb');
                    if (arr.length) {
                        var indexesToSplice = [];
                        for (var k = 0; k < this._destroyCallbacks.length; k++) {
                            if (arr.indexOf(this._destroyCallbacks[k].Element) > -1) {
                                var cb = this._destroyCallbacks[k];
                                if (typeof cb.Callback === 'function') {
                                    cb.Callback.apply(cb.Target, [this._destroyCallbacks[k].Element].concat(cb.CallbackArguments));
                                }
                                else {
                                    window[cb.Callback].apply(cb.Target, [this._destroyCallbacks[k].Element].concat(cb.CallbackArguments));
                                }
                            }
                            indexesToSplice.push(k);
                        }
                        for (var l = 0; l < indexesToSplice.length; l++) {
                            this._destroyCallbacks.splice(l, 1);
                        }
                    }
                };
                EventsDelegatorService.prototype.collectElementsHavingAttribute = function (parent, attribute) {
                    var matching = parent.querySelectorAll("[" + attribute + "]");
                    var arr = [];
                    for (var i = 0; i < matching.length; i++) {
                        arr.push(matching[i]);
                    }
                    if (parent.hasAttribute(attribute))
                        arr.push(parent);
                    return arr;
                };
                return EventsDelegatorService;
            }());
            Services.EventsDelegatorService = EventsDelegatorService;
        })(Services = Lattice.Services || (Lattice.Services = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var QueryScope;
        (function (QueryScope) {
            QueryScope[QueryScope["Server"] = 0] = "Server";
            QueryScope[QueryScope["Client"] = 1] = "Client";
            QueryScope[QueryScope["Transboundary"] = 2] = "Transboundary";
        })(QueryScope = Lattice.QueryScope || (Lattice.QueryScope = {}));
        var EventDirection;
        (function (EventDirection) {
            EventDirection[EventDirection["Before"] = 0] = "Before";
            EventDirection[EventDirection["After"] = 1] = "After";
            EventDirection[EventDirection["Undirected"] = 2] = "Undirected";
        })(EventDirection = Lattice.EventDirection || (Lattice.EventDirection = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var IeCheck = (function () {
            function IeCheck() {
            }
            IeCheck.detectIe = function () {
                var v = 3, div = document.createElement('div'), all = div.getElementsByTagName('i');
                while (div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->', all[0])
                    ;
                this.ieVersion = v > 4 ? v : null;
            };
            IeCheck.isIeGreater = function (version) {
                if (this.ieVersion == null)
                    return true;
                return this.ieVersion > version;
            };
            IeCheck.ieVersion = null;
            return IeCheck;
        }());
        Lattice.IeCheck = IeCheck;
        Reinforced.Lattice.IeCheck.detectIe();
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var MessageType;
        (function (MessageType) {
            MessageType[MessageType["UserMessage"] = 0] = "UserMessage";
            MessageType[MessageType["Banner"] = 1] = "Banner";
        })(MessageType = Lattice.MessageType || (Lattice.MessageType = {}));
        var Ordering;
        (function (Ordering) {
            Ordering[Ordering["Ascending"] = 0] = "Ascending";
            Ordering[Ordering["Descending"] = 1] = "Descending";
            Ordering[Ordering["Neutral"] = 2] = "Neutral";
        })(Ordering = Lattice.Ordering || (Lattice.Ordering = {}));
        var SelectAllBehavior;
        (function (SelectAllBehavior) {
            SelectAllBehavior[SelectAllBehavior["AllVisible"] = 0] = "AllVisible";
            SelectAllBehavior[SelectAllBehavior["OnlyIfAllDataVisible"] = 1] = "OnlyIfAllDataVisible";
            SelectAllBehavior[SelectAllBehavior["AllLoadedData"] = 2] = "AllLoadedData";
            SelectAllBehavior[SelectAllBehavior["Disabled"] = 3] = "Disabled";
        })(SelectAllBehavior = Lattice.SelectAllBehavior || (Lattice.SelectAllBehavior = {}));
        var ResetSelectionBehavior;
        (function (ResetSelectionBehavior) {
            ResetSelectionBehavior[ResetSelectionBehavior["DontReset"] = 0] = "DontReset";
            ResetSelectionBehavior[ResetSelectionBehavior["ServerReload"] = 1] = "ServerReload";
            ResetSelectionBehavior[ResetSelectionBehavior["ClientReload"] = 2] = "ClientReload";
        })(ResetSelectionBehavior = Lattice.ResetSelectionBehavior || (Lattice.ResetSelectionBehavior = {}));
        var PartitionType;
        (function (PartitionType) {
            PartitionType[PartitionType["Client"] = 0] = "Client";
            PartitionType[PartitionType["Server"] = 1] = "Server";
            PartitionType[PartitionType["Sequential"] = 2] = "Sequential";
        })(PartitionType = Lattice.PartitionType || (Lattice.PartitionType = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Plugins;
        (function (Plugins) {
            var LoadingOverlap;
            (function (LoadingOverlap) {
                var OverlapMode;
                (function (OverlapMode) {
                    OverlapMode[OverlapMode["All"] = 0] = "All";
                    OverlapMode[OverlapMode["BodyOnly"] = 1] = "BodyOnly";
                    OverlapMode[OverlapMode["Parent"] = 2] = "Parent";
                })(OverlapMode = LoadingOverlap.OverlapMode || (LoadingOverlap.OverlapMode = {}));
            })(LoadingOverlap = Plugins.LoadingOverlap || (Plugins.LoadingOverlap = {}));
        })(Plugins = Lattice.Plugins || (Lattice.Plugins = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Plugins;
        (function (Plugins) {
            var Hierarchy;
            (function (Hierarchy) {
                var NodeExpandBehavior;
                (function (NodeExpandBehavior) {
                    NodeExpandBehavior[NodeExpandBehavior["LoadFromCacheWhenPossible"] = 0] = "LoadFromCacheWhenPossible";
                    NodeExpandBehavior[NodeExpandBehavior["AlwaysLoadRemotely"] = 1] = "AlwaysLoadRemotely";
                })(NodeExpandBehavior = Hierarchy.NodeExpandBehavior || (Hierarchy.NodeExpandBehavior = {}));
                var TreeCollapsedNodeFilterBehavior;
                (function (TreeCollapsedNodeFilterBehavior) {
                    TreeCollapsedNodeFilterBehavior[TreeCollapsedNodeFilterBehavior["IncludeCollapsed"] = 0] = "IncludeCollapsed";
                    TreeCollapsedNodeFilterBehavior[TreeCollapsedNodeFilterBehavior["ExcludeCollapsed"] = 1] = "ExcludeCollapsed";
                })(TreeCollapsedNodeFilterBehavior = Hierarchy.TreeCollapsedNodeFilterBehavior || (Hierarchy.TreeCollapsedNodeFilterBehavior = {}));
            })(Hierarchy = Plugins.Hierarchy || (Plugins.Hierarchy = {}));
        })(Plugins = Lattice.Plugins || (Lattice.Plugins = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Adjustments;
        (function (Adjustments) {
            var SelectionToggle;
            (function (SelectionToggle) {
                SelectionToggle[SelectionToggle["LeaveAsIs"] = 0] = "LeaveAsIs";
                SelectionToggle[SelectionToggle["All"] = 1] = "All";
                SelectionToggle[SelectionToggle["Nothing"] = 2] = "Nothing";
            })(SelectionToggle = Adjustments.SelectionToggle || (Adjustments.SelectionToggle = {}));
        })(Adjustments = Lattice.Adjustments || (Lattice.Adjustments = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Plugins;
        (function (Plugins) {
            var RegularSelect;
            (function (RegularSelect) {
                var RegularSelectMode;
                (function (RegularSelectMode) {
                    RegularSelectMode[RegularSelectMode["Rows"] = 0] = "Rows";
                    RegularSelectMode[RegularSelectMode["Cells"] = 1] = "Cells";
                })(RegularSelectMode = RegularSelect.RegularSelectMode || (RegularSelect.RegularSelectMode = {}));
            })(RegularSelect = Plugins.RegularSelect || (Plugins.RegularSelect = {}));
        })(Plugins = Lattice.Plugins || (Lattice.Plugins = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Commands;
        (function (Commands) {
            var CommandType;
            (function (CommandType) {
                CommandType[CommandType["Client"] = 0] = "Client";
                CommandType[CommandType["Server"] = 1] = "Server";
            })(CommandType = Commands.CommandType || (Commands.CommandType = {}));
        })(Commands = Lattice.Commands || (Lattice.Commands = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Plugins;
        (function (Plugins) {
            var Scrollbar;
            (function (Scrollbar) {
                var StickDirection;
                (function (StickDirection) {
                    StickDirection[StickDirection["Right"] = 0] = "Right";
                    StickDirection[StickDirection["Left"] = 1] = "Left";
                    StickDirection[StickDirection["Top"] = 2] = "Top";
                    StickDirection[StickDirection["Bottom"] = 3] = "Bottom";
                })(StickDirection = Scrollbar.StickDirection || (Scrollbar.StickDirection = {}));
                var StickHollow;
                (function (StickHollow) {
                    StickHollow[StickHollow["Internal"] = 0] = "Internal";
                    StickHollow[StickHollow["External"] = 1] = "External";
                })(StickHollow = Scrollbar.StickHollow || (Scrollbar.StickHollow = {}));
                var KeyboardScrollFocusMode;
                (function (KeyboardScrollFocusMode) {
                    KeyboardScrollFocusMode[KeyboardScrollFocusMode["Manual"] = 0] = "Manual";
                    KeyboardScrollFocusMode[KeyboardScrollFocusMode["MouseOver"] = 1] = "MouseOver";
                    KeyboardScrollFocusMode[KeyboardScrollFocusMode["MouseClick"] = 2] = "MouseClick";
                })(KeyboardScrollFocusMode = Scrollbar.KeyboardScrollFocusMode || (Scrollbar.KeyboardScrollFocusMode = {}));
            })(Scrollbar = Plugins.Scrollbar || (Plugins.Scrollbar = {}));
        })(Plugins = Lattice.Plugins || (Lattice.Plugins = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Master = (function () {
            function Master(configuration) {
                this.Configuration = configuration;
                this.Stats = new Reinforced.Lattice.Services.StatsService(this);
                this.Date = new Reinforced.Lattice.Services.DateService(this.Configuration.DatepickerOptions);
                this.Events = new Reinforced.Lattice.Services.EventsService(this);
                this.InstanceManager = new Reinforced.Lattice.Services.InstanceManagerService(this.Configuration, this, this.Events);
                this.DataHolder = new Reinforced.Lattice.Services.DataHolderService(this);
                this.Loader = new Reinforced.Lattice.Services.LoaderService(this.Configuration.StaticData, this);
                this.Controller = new Reinforced.Lattice.Services.Controller(this);
                this.Selection = new Reinforced.Lattice.Services.SelectionService(this);
                this.Commands = new Reinforced.Lattice.Services.CommandsService(this);
                switch (this.Configuration.Partition.Type) {
                    case Reinforced.Lattice.PartitionType.Client:
                        this.Partition = new Reinforced.Lattice.Services.Partition.ClientPartitionService(this);
                        break;
                    case Reinforced.Lattice.PartitionType.Server:
                        this.Partition = new Reinforced.Lattice.Services.Partition.ServerPartitionService(this);
                        break;
                    case Reinforced.Lattice.PartitionType.Sequential:
                        this.Partition = new Reinforced.Lattice.Services.Partition.SequentialPartitionService(this);
                        break;
                }
                if (!window['__latticeInstances'])
                    window['__latticeInstances'] = {};
                window['__latticeInstances'][this.Configuration.TableRootId] = this;
                this.bindReady();
            }
            Master.prototype.bindReady = function () {
                var _self = this;
                if (document.addEventListener) {
                    document.addEventListener('DOMContentLoaded', function () {
                        document.removeEventListener('DOMContentLoaded', arguments.callee, false);
                        _self.initialize();
                    }, false);
                }
                else if (document.attachEvent) {
                    document.attachEvent('onreadystatechange', function () {
                        if (document.readyState === 'complete') {
                            document.detachEvent('onreadystatechange', arguments.callee);
                            _self.initialize();
                        }
                    });
                    if (document.documentElement.doScroll && window == window.top)
                        (function () {
                            if (_self._isReady)
                                return;
                            try {
                                document.documentElement.doScroll('left');
                            }
                            catch (error) {
                                setTimeout(arguments.callee, 0);
                                return;
                            }
                            _self.initialize();
                        })();
                }
                window.addEventListener('load', function (e) {
                    if (_self._isReady)
                        return;
                    _self.initialize();
                });
            };
            Master.prototype.initialize = function () {
                this.Renderer = new Reinforced.Lattice.Rendering.Renderer(this.Configuration.TableRootId, this.Configuration.Prefix, this);
                this.MessageService = new Reinforced.Lattice.Services.MessagesService(this.Configuration.MessageFunction, this.InstanceManager, this.Controller, this.Renderer, this.Configuration.CoreTemplates);
                this._isReady = true;
                this.InstanceManager.initPlugins();
                this.Renderer.layout();
                if (this.Configuration.CallbackFunction) {
                    this.Configuration.CallbackFunction(this);
                }
                this.InstanceManager._subscribeConfiguredEvents();
                this.Partition.initial(this.Configuration.Partition.InitialSkip, this.Configuration.Partition.InitialTake);
                if (this.Configuration.PrefetchedData != null && this.Configuration.PrefetchedData.length > 0) {
                    this.Loader.prefetchData(this.Configuration.PrefetchedData);
                    this.Controller.redrawVisibleData();
                }
                else {
                    if (this.Configuration.LoadImmediately) {
                        this.Controller.reload();
                    }
                    else {
                        this.MessageService.showMessage({
                            Class: this.Configuration.CoreTemplates.InitialMessage,
                            Title: 'No filtering specified',
                            Details: 'To retrieve query results please specify several filters',
                            Type: Lattice.MessageType.Banner
                        });
                    }
                }
            };
            Master.prototype.reload = function (forceServer, callback) {
                this.Controller.reload(forceServer, callback);
            };
            Master.fireDomEvent = function (eventName, element) {
                if ('createEvent' in document) {
                    var evt = document.createEvent('HTMLEvents');
                    evt.initEvent(eventName, false, true);
                    element.dispatchEvent(evt);
                }
                else
                    element['fireEvent'](eventName);
            };
            Master.prototype.proceedAdjustments = function (adjustments) {
                var result = this.DataHolder.proceedAdjustments(adjustments);
                if (result != null)
                    this.Controller.drawAdjustmentResult(result);
            };
            Master.prototype.getStaticData = function () {
                if (!this.Configuration.StaticData)
                    return null;
                return JSON.parse(this.Configuration.StaticData);
            };
            Master.prototype.setStaticData = function (obj) {
                this.Configuration.StaticData = JSON.stringify(obj);
            };
            return Master;
        }());
        Lattice.Master = Master;
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var TrackHelper = (function () {
            function TrackHelper() {
            }
            TrackHelper.getCellTrack = function (cell) {
                var colIdx = cell.Column.Order;
                var rowIdx = cell.Row.Index;
                return this.getCellTrackByIndexes(rowIdx, colIdx);
            };
            TrackHelper.getCellTrackByIndexes = function (rowIndex, columnIndex) {
                return "c-r" + rowIndex + "-c" + columnIndex;
            };
            TrackHelper.getPluginTrack = function (plugin) {
                return "p-" + plugin.PluginLocation;
            };
            TrackHelper.getPluginTrackByLocation = function (pluginLocation) {
                return "p-" + pluginLocation;
            };
            TrackHelper.getHeaderTrack = function (header) {
                return "h-" + header.Column.RawName;
            };
            TrackHelper.getHeaderTrackByColumnName = function (columnName) {
                return "h-" + columnName;
            };
            TrackHelper.getRowTrack = function (row) {
                return this.getRowTrackByIndex(row.Index);
            };
            TrackHelper.getLineTrack = function (line) {
                return this.getLineTrackByIndex(line.Number);
            };
            TrackHelper.getLineTrackByIndex = function (lineNumber) {
                return "ln-" + lineNumber;
            };
            TrackHelper.getRowTrackByObject = function (dataObject) {
                return this.getRowTrackByIndex(dataObject['__i']);
            };
            TrackHelper.getMessageTrack = function () {
                return 'r-msg';
            };
            TrackHelper.getPartitionRowTrack = function () {
                return 'r-partition';
            };
            TrackHelper.getRowTrackByIndex = function (index) {
                return "r-" + index;
            };
            TrackHelper.getCellLocation = function (e) {
                if (!e)
                    return null;
                if (!e.getAttribute)
                    return null;
                var trk = e.getAttribute('data-track').substring(3).split('-c');
                return {
                    RowIndex: parseInt(trk[0]),
                    ColumnIndex: parseInt(trk[1])
                };
            };
            TrackHelper.getRowIndex = function (e) {
                if (!e)
                    return null;
                if (!e.getAttribute)
                    return null;
                var trk = e.getAttribute('data-track').substring(2);
                return parseInt(trk);
            };
            return TrackHelper;
        }());
        Lattice.TrackHelper = TrackHelper;
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Plugins;
        (function (Plugins) {
            var PluginBase = (function () {
                function PluginBase() {
                    this.afterDrawn = null;
                }
                PluginBase.prototype.init = function (masterTable) {
                    this.MasterTable = masterTable;
                    this.Configuration = this.RawConfig.Configuration;
                    if (masterTable.Events != null)
                        this.subscribe(masterTable.Events);
                };
                PluginBase.prototype.subscribe = function (e) {
                    if (this.afterDrawn != null) {
                        this.MasterTable.Events.LayoutRendered.subscribeAfter(this.afterDrawn.bind(this), this.RawConfig.PluginId);
                    }
                };
                PluginBase.prototype.defaultRender = function (p) {
                    return p.nest(this, this.RawConfig.TemplateId);
                };
                return PluginBase;
            }());
            Plugins.PluginBase = PluginBase;
        })(Plugins = Lattice.Plugins || (Lattice.Plugins = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Editing;
        (function (Editing) {
            var EditHandlerBase = (function (_super) {
                __extends(EditHandlerBase, _super);
                function EditHandlerBase() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.Cells = {};
                    _this.IsSpecial = false;
                    _this.Command = null;
                    _this.DisplayIndex = 0;
                    _this.ValidationMessages = [];
                    _this.EditorConfigurations = {};
                    return _this;
                }
                EditHandlerBase.prototype.commit = function (editor) {
                    throw Error("Not implemented");
                };
                EditHandlerBase.prototype.notifyChanged = function (editor) {
                    throw Error("Not implemented");
                };
                EditHandlerBase.prototype.reject = function (editor) {
                    throw Error("Not implemented");
                };
                EditHandlerBase.prototype.dispatchEditResponse = function (editResponse, then) {
                    if (then)
                        then();
                };
                EditHandlerBase.prototype.isEditable = function (column) {
                    return this.EditorConfigurations.hasOwnProperty(column.RawName);
                };
                EditHandlerBase.prototype.sendDataObjectToServer = function (then, errorCallback) {
                    var _this = this;
                    this.MasterTable.Loader.command('Edit', function (r) { return _this.dispatchEditResponse(r, then); }, function (q) {
                        q.AdditionalData['Edit'] = JSON.stringify(_this.CurrentDataObjectModified);
                        return q;
                    }, errorCallback);
                };
                EditHandlerBase.prototype.hasChanges = function () {
                    for (var k in this.DataObject) {
                        if (this.DataObject[k] !== this.CurrentDataObjectModified[k])
                            return true;
                    }
                    return false;
                };
                EditHandlerBase.prototype.setEditorValue = function (editor) {
                    editor.IsInitialValueSetting = true;
                    editor.setValue(this.CurrentDataObjectModified[editor.FieldName]);
                    editor.IsInitialValueSetting = false;
                };
                EditHandlerBase.prototype.createEditor = function (fieldName, column, canComplete, editorType) {
                    var editorConf = this.EditorConfigurations[fieldName];
                    var editor = Lattice.ComponentsContainer.resolveComponent(editorConf.PluginId);
                    editor.DataObject = this.DataObject;
                    editor.ModifiedDataObject = this.CurrentDataObjectModified;
                    editor.Data = this.DataObject[fieldName];
                    editor.FieldName = fieldName;
                    editor.Column = column;
                    editor.CanComplete = canComplete;
                    editor.IsFormEdit = editorType === EditorMode.Form;
                    editor.IsRowEdit = editorType === EditorMode.Row;
                    editor.IsCellEdit = !(editor.IsFormEdit || editor.IsRowEdit);
                    editor.Row = this;
                    editor.RawConfig = {
                        Configuration: editorConf,
                        Order: 0,
                        PluginId: editorConf.PluginId,
                        Placement: '', TemplateId: editorConf.TemplateId
                    };
                    editor.init(this.MasterTable);
                    return editor;
                };
                EditHandlerBase.prototype.retrieveEditorData = function (editor, errors) {
                    var errorsArrayPresent = (!(!errors));
                    errors = errors || [];
                    var thisErrors = [];
                    this.CurrentDataObjectModified[editor.FieldName] = editor.getValue(thisErrors);
                    for (var j = 0; j < thisErrors.length; j++) {
                        thisErrors[j].Message = editor.getErrorMessage(thisErrors[j].Code);
                    }
                    editor.Data = this.CurrentDataObjectModified[editor.FieldName];
                    editor.ValidationMessages = thisErrors;
                    for (var i = 0; i < thisErrors.length; i++) {
                        errors.push(thisErrors[i]);
                    }
                    if (thisErrors.length > 0) {
                        editor.IsValid = false;
                        if (editor.VisualStates != null)
                            editor.VisualStates.changeState('invalid');
                    }
                    else {
                        editor.IsValid = true;
                        if (editor.VisualStates != null)
                            editor.VisualStates.normalState();
                    }
                    if (!errorsArrayPresent) {
                        this.ValidationMessages.concat(errors);
                    }
                };
                EditHandlerBase.prototype.init = function (masterTable) {
                    _super.prototype.init.call(this, masterTable);
                    for (var i = 0; i < this.Configuration.Fields.length; i++) {
                        this.EditorConfigurations[this.Configuration.Fields[i].FieldName] = this.Configuration.Fields[i];
                    }
                };
                EditHandlerBase.prototype.subscribe = function (e) {
                    _super.prototype.subscribe.call(this, e);
                    e.Adjustment.subscribeAfter(this.onAdjustment.bind(this), 'EditHandler');
                };
                return EditHandlerBase;
            }(Reinforced.Lattice.Plugins.PluginBase));
            Editing.EditHandlerBase = EditHandlerBase;
            var EditorMode;
            (function (EditorMode) {
                EditorMode[EditorMode["Cell"] = 0] = "Cell";
                EditorMode[EditorMode["Row"] = 1] = "Row";
                EditorMode[EditorMode["Form"] = 2] = "Form";
            })(EditorMode = Editing.EditorMode || (Editing.EditorMode = {}));
        })(Editing = Lattice.Editing || (Lattice.Editing = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Editing;
        (function (Editing) {
            var EditorBase = (function (_super) {
                __extends(EditorBase, _super);
                function EditorBase() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.ValidationMessages = [];
                    return _this;
                }
                EditorBase.prototype.renderedValidationMessages = function () {
                    return this.MasterTable.Renderer.renderToString(this.Configuration.ValidationMessagesTemplateId, {
                        Messages: this.ValidationMessages,
                        IsRowEdit: this.IsRowEdit,
                        IsFormEdit: this.IsFormEdit
                    });
                };
                EditorBase.prototype.getThisOriginalValue = function () {
                    return this.DataObject[this.Column.RawName];
                };
                EditorBase.prototype.reset = function () {
                    this.setValue(this.getThisOriginalValue());
                };
                EditorBase.prototype.getValue = function (errors) { throw new Error("Not implemented"); };
                EditorBase.prototype.setValue = function (value) { throw new Error("Not implemented"); };
                EditorBase.prototype.changedHandler = function (e) {
                    if (this.IsInitialValueSetting)
                        return;
                    this.Row.notifyChanged(this);
                };
                EditorBase.prototype.commitHandler = function (e) {
                    if (this.IsInitialValueSetting)
                        return;
                    this.Row.commit(this);
                };
                EditorBase.prototype.rejectHandler = function (e) {
                    if (this.IsInitialValueSetting)
                        return;
                    this.Row.reject(this);
                };
                EditorBase.prototype.onAfterRender = function (e) { };
                EditorBase.prototype.focus = function () { };
                EditorBase.prototype.OriginalContent = function (p) {
                    Reinforced.Lattice.Templating.Driver.cellContent(this, p);
                };
                EditorBase.prototype.notifyObjectChanged = function () { };
                EditorBase.prototype.defineMessages = function () {
                    return {};
                };
                EditorBase.prototype.getErrorMessage = function (key) {
                    if (!this._errorMessages.hasOwnProperty(key))
                        return 'Error';
                    return this._errorMessages[key];
                };
                EditorBase.prototype.init = function (masterTable) {
                    _super.prototype.init.call(this, masterTable);
                    this._errorMessages = this.defineMessages();
                    for (var k in this.Configuration.ValidationMessagesOverride) {
                        this._errorMessages[k] = this.Configuration.ValidationMessagesOverride[k];
                    }
                };
                return EditorBase;
            }(Reinforced.Lattice.Plugins.PluginBase));
            Editing.EditorBase = EditorBase;
        })(Editing = Lattice.Editing || (Lattice.Editing = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Editing;
        (function (Editing) {
            var Editors;
            (function (Editors) {
                var Cells;
                (function (Cells) {
                    var CellsEditHandler = (function (_super) {
                        __extends(CellsEditHandler, _super);
                        function CellsEditHandler() {
                            var _this = _super !== null && _super.apply(this, arguments) || this;
                            _this._isEditing = false;
                            _this.afterDrawn = function (e) {
                                _this.MasterTable.Events.DataRendered.subscribeAfter(_this.onAfterRender.bind(_this), 'editor');
                            };
                            _this._isRedrawnByAdjustment = false;
                            return _this;
                        }
                        CellsEditHandler.prototype.ensureEditing = function (loadIndex) {
                            if (this._isEditing)
                                return;
                            this.DataObject = this.MasterTable.DataHolder.StoredCache[loadIndex];
                            this.DisplayIndex = this.MasterTable.DataHolder.DisplayedData.indexOf(this.DataObject);
                            var isLast = this.MasterTable.DataHolder.DisplayedData.length == 0
                                ? true
                                : (this.MasterTable.DataHolder.DisplayedData[this.MasterTable.DataHolder.DisplayedData.length - 1] ==
                                    this.DataObject);
                            this.IsLast = isLast;
                            this.CurrentDataObjectModified = {};
                            for (var cd in this.DataObject) {
                                if (this.DataObject.hasOwnProperty(cd)) {
                                    this.CurrentDataObjectModified[cd] = this.DataObject[cd];
                                }
                            }
                            this.MasterTable.Events.Edit.invokeBefore(this, this.CurrentDataObjectModified);
                            var row = this.MasterTable.Controller.produceRow(this.DataObject);
                            this.Cells = row.Cells;
                            this.Index = loadIndex;
                            this._isEditing = true;
                        };
                        CellsEditHandler.prototype.beginCellEdit = function (column, rowIndex) {
                            if (!this.isEditable(column))
                                return;
                            this.ensureEditing(rowIndex);
                            var editor = this.createEditor(column.RawName, column, true, Editing.EditorMode.Cell);
                            this.Cells[column.RawName] = editor;
                            this._activeEditor = editor;
                            var e = this.MasterTable.Renderer.Modifier.redrawCell(editor);
                            editor.onAfterRender(e);
                            this.setEditorValue(editor);
                            editor.focus();
                            return editor;
                        };
                        CellsEditHandler.prototype.beginCellEditHandle = function (e) {
                            if (this._isEditing)
                                return;
                            var col = this.MasterTable.InstanceManager.getColumnByOrder(e.Column);
                            this.beginCellEdit(col, e.Row);
                            e.Stop = true;
                        };
                        CellsEditHandler.prototype.onAfterRender = function (e) {
                            if (!this._isEditing)
                                return;
                            if (this._activeEditor != null) {
                                this._activeEditor.onAfterRender(null);
                                this.setEditorValue(this._activeEditor);
                            }
                        };
                        CellsEditHandler.prototype.commit = function (editor) {
                            var _this = this;
                            var msgs = [];
                            this.retrieveEditorData(editor, msgs);
                            if (msgs.length !== 0) {
                                this.MasterTable.Events.EditValidationFailed.invokeAfter(this, {
                                    OriginalDataObject: this.DataObject,
                                    ModifiedDataObject: this.CurrentDataObjectModified,
                                    Messages: msgs
                                });
                                return;
                            }
                            if (editor.VisualStates != null)
                                editor.VisualStates.changeState('saving');
                            this.finishEditing(editor, false);
                            this._isRedrawnByAdjustment = false;
                            this.sendDataObjectToServer(function () {
                                _this.MasterTable.Events.Edit.invokeAfter(_this, _this.CurrentDataObjectModified);
                                if (!_this._isRedrawnByAdjustment) {
                                    var obj = _this.MasterTable.DataHolder.getByPrimaryKey(_this.CurrentDataObjectModified['__key']);
                                    _this.MasterTable.Controller.redrawVisibleDataObject(obj);
                                }
                                _this.CurrentDataObjectModified = null;
                            }, function (_) {
                                if (editor.VisualStates != null)
                                    editor.VisualStates.normalState();
                            });
                        };
                        CellsEditHandler.prototype.finishEditing = function (editor, redraw) {
                            if (redraw && editor.VisualStates != null)
                                editor.VisualStates.normalState();
                            this._activeEditor = null;
                            this.Cells[editor.Column.RawName] = this.MasterTable.Controller.produceCell(this.DataObject, editor.Column, this);
                            if (redraw) {
                                this.MasterTable.Renderer.Modifier.redrawCell(this.Cells[editor.Column.RawName]);
                            }
                            this.cleanupAfterEdit();
                        };
                        CellsEditHandler.prototype.cleanupAfterEdit = function () {
                            this._isEditing = false;
                            this._activeEditor = null;
                            this.Cells = {};
                        };
                        CellsEditHandler.prototype.onAdjustment = function (e) {
                            if (!this._isEditing)
                                return;
                            var obj = this.MasterTable.DataHolder.getByPrimaryKey(this.CurrentDataObjectModified['__key']);
                            var isAdded = e.EventArgs.AddedData.indexOf(obj) > -1;
                            var isUpdated = e.EventArgs.TouchedData.indexOf(obj) > -1;
                            this._isRedrawnByAdjustment = isAdded || isUpdated;
                        };
                        CellsEditHandler.prototype.notifyChanged = function (editor) {
                            this.retrieveEditorData(editor);
                        };
                        CellsEditHandler.prototype.reject = function (editor) {
                            this.finishEditing(editor, true);
                        };
                        CellsEditHandler.prototype.provide = function (rows) {
                            if (!this._isEditing)
                                return;
                            for (var i = 0; i < rows.length; i++) {
                                if (rows[i].DataObject['__key'] === this.DataObject['__key']) {
                                    rows[i] = this;
                                }
                            }
                        };
                        CellsEditHandler.prototype.init = function (masterTable) {
                            _super.prototype.init.call(this, masterTable);
                            masterTable.Controller.registerAdditionalRowsProvider(this);
                        };
                        return CellsEditHandler;
                    }(Editing.EditHandlerBase));
                    Cells.CellsEditHandler = CellsEditHandler;
                    Lattice.ComponentsContainer.registerComponent('CellsEditHandler', CellsEditHandler);
                })(Cells = Editors.Cells || (Editors.Cells = {}));
            })(Editors = Editing.Editors || (Editing.Editors = {}));
        })(Editing = Lattice.Editing || (Lattice.Editing = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Editing;
        (function (Editing) {
            var Editors;
            (function (Editors) {
                var Check;
                (function (Check) {
                    var CheckEditor = (function (_super) {
                        __extends(CheckEditor, _super);
                        function CheckEditor() {
                            return _super !== null && _super.apply(this, arguments) || this;
                        }
                        CheckEditor.prototype.renderContent = function (p) {
                            this.defaultRender(p);
                        };
                        CheckEditor.prototype.changedHandler = function (e) {
                            this._value = !this._value;
                            this.updateState();
                            _super.prototype.changedHandler.call(this, e);
                        };
                        CheckEditor.prototype.updateState = function () {
                            if (!this._value) {
                                this.VisualStates.unmixinState('checked');
                            }
                            else {
                                this.VisualStates.mixinState('checked');
                            }
                        };
                        CheckEditor.prototype.getValue = function (errors) {
                            if (this.Configuration.IsMandatory && !this._value) {
                                errors.push({ Code: 'MANDATORY' });
                                return null;
                            }
                            return this._value;
                        };
                        CheckEditor.prototype.setValue = function (value) {
                            this._value = (!(!value));
                            if (!this.VisualStates)
                                return;
                            this.updateState();
                        };
                        CheckEditor.prototype.focus = function () {
                            if (this.FocusElement)
                                this.FocusElement.focus();
                        };
                        CheckEditor.prototype.defineMessages = function () {
                            return {
                                'MANDATORY': this.Column.Configuration.Title + " is required"
                            };
                        };
                        return CheckEditor;
                    }(Reinforced.Lattice.Editing.EditorBase));
                    Check.CheckEditor = CheckEditor;
                    Lattice.ComponentsContainer.registerComponent('CheckEditor', CheckEditor);
                })(Check = Editors.Check || (Editors.Check = {}));
            })(Editors = Editing.Editors || (Editing.Editors = {}));
        })(Editing = Lattice.Editing || (Lattice.Editing = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Editing;
        (function (Editing) {
            var Editors;
            (function (Editors) {
                var Display;
                (function (Display) {
                    var DisplayEditor = (function (_super) {
                        __extends(DisplayEditor, _super);
                        function DisplayEditor() {
                            return _super !== null && _super.apply(this, arguments) || this;
                        }
                        DisplayEditor.prototype.renderContent = function (p) {
                            this.defaultRender(p);
                        };
                        DisplayEditor.prototype.Render = function (p) {
                            this._previousContent = this.Configuration.Template(this);
                            p.w(this._previousContent);
                        };
                        DisplayEditor.prototype.notifyObjectChanged = function () {
                            var cont = this.Configuration.Template(this);
                            if (cont !== this._previousContent) {
                                this.ContentElement.innerHTML = cont;
                                this._previousContent = cont;
                            }
                        };
                        DisplayEditor.prototype.getValue = function (errors) {
                            return this.DataObject[this.Column.RawName];
                        };
                        DisplayEditor.prototype.setValue = function (value) { };
                        DisplayEditor.prototype.init = function (masterTable) {
                            _super.prototype.init.call(this, masterTable);
                            if (this.Configuration.Template == null || this.Configuration.Template == undefined) {
                                this.Configuration.Template = function (x) {
                                    return x.Data.toString();
                                };
                            }
                        };
                        return DisplayEditor;
                    }(Reinforced.Lattice.Editing.EditorBase));
                    Display.DisplayEditor = DisplayEditor;
                    Lattice.ComponentsContainer.registerComponent('DisplayEditor', DisplayEditor);
                })(Display = Editors.Display || (Editors.Display = {}));
            })(Editors = Editing.Editors || (Editing.Editors = {}));
        })(Editing = Lattice.Editing || (Lattice.Editing = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Editing;
        (function (Editing) {
            var Editors;
            (function (Editors) {
                var Memo;
                (function (Memo) {
                    var MemoEditor = (function (_super) {
                        __extends(MemoEditor, _super);
                        function MemoEditor() {
                            return _super !== null && _super.apply(this, arguments) || this;
                        }
                        MemoEditor.prototype.init = function (masterTable) {
                            _super.prototype.init.call(this, masterTable);
                            this.MaxChars = this.Configuration.MaxChars;
                            this.WarningChars = this.Configuration.WarningChars;
                            this.Rows = this.Configuration.Rows;
                            this.Columns = this.Configuration.Columns;
                            this.CurrentChars = 0;
                        };
                        MemoEditor.prototype.changedHandler = function (e) {
                            this.CurrentChars = this.TextArea.value.length;
                            if (this.WarningChars !== 0 && this.CurrentChars >= this.WarningChars && this.CurrentChars <= this.MaxChars) {
                                this.VisualStates.mixinState('warning');
                            }
                            else {
                                this.VisualStates.unmixinState('warning');
                            }
                            _super.prototype.changedHandler.call(this, e);
                        };
                        MemoEditor.prototype.setValue = function (value) {
                            if (!this.TextArea)
                                return;
                            this.TextArea.value = value;
                        };
                        MemoEditor.prototype.getValue = function (errors) {
                            var value = this.TextArea.value;
                            if (this.MaxChars > 0 && value.length > this.MaxChars) {
                                errors.push({ Code: 'MAXCHARS' });
                                return null;
                            }
                            if (!this.Configuration.AllowEmptyString) {
                                if (value == null || value == undefined || value.length === 0) {
                                    errors.push({ Code: 'EMPTYSTRING' });
                                    return null;
                                }
                            }
                            return value;
                        };
                        MemoEditor.prototype.renderContent = function (p) {
                            this.defaultRender(p);
                        };
                        MemoEditor.prototype.focus = function () {
                            this.TextArea.focus();
                            this.TextArea.setSelectionRange(0, this.TextArea.value.length);
                        };
                        MemoEditor.prototype.defineMessages = function () {
                            return {
                                'MAXCHARS': "Maximum " + this.Column.Configuration.Title + " length exceeded",
                                'EMPTYSTRING': this.Column.Configuration.Title + " must not be an empty string"
                            };
                        };
                        return MemoEditor;
                    }(Reinforced.Lattice.Editing.EditorBase));
                    Memo.MemoEditor = MemoEditor;
                    Lattice.ComponentsContainer.registerComponent('MemoEditor', MemoEditor);
                })(Memo = Editors.Memo || (Editors.Memo = {}));
            })(Editors = Editing.Editors || (Editing.Editors = {}));
        })(Editing = Lattice.Editing || (Lattice.Editing = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Editing;
        (function (Editing) {
            var Editors;
            (function (Editors) {
                var PlainText;
                (function (PlainText) {
                    var PlainTextEditor = (function (_super) {
                        __extends(PlainTextEditor, _super);
                        function PlainTextEditor() {
                            var _this = _super !== null && _super.apply(this, arguments) || this;
                            _this._floatRegex = new RegExp("^[0-9]+(\.[0-9]+)?$");
                            return _this;
                        }
                        PlainTextEditor.prototype.getValue = function (errors) {
                            if (this.Column.IsDateTime) {
                                var d = this.MasterTable.Date.getDateFromDatePicker(this.Input);
                                if ((d == null) && !this.Column.Configuration.IsNullable) {
                                    errors.push({ Code: 'NULL' });
                                    return null;
                                }
                                return d;
                            }
                            else {
                                return this._parseFunction(this.Input.value, this.Column, errors);
                            }
                        };
                        PlainTextEditor.prototype.setValue = function (value) {
                            if (!this.Input)
                                return;
                            if (this.Column.IsDateTime) {
                                this.MasterTable.Date.putDateToDatePicker(this.Input, value);
                            }
                            else {
                                this.Input.value = this._formatFunction(value, this.Column);
                            }
                        };
                        PlainTextEditor.prototype.init = function (masterTable) {
                            _super.prototype.init.call(this, masterTable);
                            if (this.Configuration.ValidationRegex) {
                                this.ValidationRegex = new RegExp(this.Configuration.ValidationRegex);
                            }
                            this._dotSeparators = new RegExp(this.Configuration.FloatDotReplaceSeparatorsRegex);
                            this._removeSeparators = new RegExp(this.Configuration.FloatRemoveSeparatorsRegex);
                            this._parseFunction = this.Configuration.ParseFunction || this.defaultParse;
                            this._formatFunction = this.Configuration.FormatFunction || this.defaultFormat;
                        };
                        PlainTextEditor.prototype.defaultParse = function (value, column, errors) {
                            if (this.ValidationRegex) {
                                var mtch = this.ValidationRegex.test(value);
                                if (!mtch) {
                                    errors.push({ Code: 'REGEX' });
                                    return null;
                                }
                                return value;
                            }
                            if (value == null || value == undefined || value.length === 0) {
                                if (!column.Configuration.IsNullable && (!column.IsString)) {
                                    errors.push({ Code: 'NULL' });
                                    return null;
                                }
                                if (column.IsString && !this.Configuration.AllowEmptyString) {
                                    errors.push({ Code: 'EMPTYSTRING' });
                                    return null;
                                }
                                return '';
                            }
                            if (this.Configuration.MaxAllowedLength > 0) {
                                if (value.length > this.Configuration.MaxAllowedLength) {
                                    errors.push({ Code: 'MAXCHARS' });
                                    return null;
                                }
                            }
                            var i;
                            if (column.IsInteger || column.IsEnum) {
                                value = value.replace(this._removeSeparators, '');
                                i = parseInt(value);
                                if (isNaN(i)) {
                                    errors.push({ Code: 'NONINT' });
                                    return null;
                                }
                                return i;
                            }
                            if (column.IsFloat) {
                                var negative = (value.length > 0 && value.charAt(0) === '-');
                                value = negative ? value.substring(1) : value;
                                value = value.replace(this._removeSeparators, '');
                                value = value.replace(this._dotSeparators, '.');
                                i = parseFloat(negative ? ('-' + value) : value);
                                if (isNaN(i) || (!this._floatRegex.test(value))) {
                                    errors.push({ Code: 'NONFLOAT' });
                                    return null;
                                }
                                return i;
                            }
                            if (column.IsBoolean) {
                                var bs = value.toUpperCase().trim();
                                if (bs === 'TRUE')
                                    return true;
                                if (bs === 'FALSE')
                                    return false;
                                errors.push({ Code: 'NONBOOL' });
                                return null;
                            }
                            return value;
                        };
                        PlainTextEditor.prototype.defaultFormat = function (value, column) {
                            if (value == null || value == undefined)
                                return '';
                            return value.toString();
                        };
                        PlainTextEditor.prototype.changedHandler = function (e) {
                            _super.prototype.changedHandler.call(this, e);
                        };
                        PlainTextEditor.prototype.renderContent = function (p) {
                            this.defaultRender(p);
                        };
                        PlainTextEditor.prototype.focus = function () {
                            this.Input.focus();
                            this.Input.setSelectionRange(0, this.Input.value.length);
                        };
                        PlainTextEditor.prototype.defineMessages = function () {
                            return {
                                'NONBOOL': "Invalid boolean value provided for " + this.Column.Configuration.Title,
                                'NONFLOAT': "Invalid number provided for " + this.Column.Configuration.Title,
                                'NONINT': "Invalid number provided for " + this.Column.Configuration.Title,
                                'MAXCHARS': "Maximum " + this.Column.Configuration.Title + " length exceeded",
                                'EMPTYSTRING': this.Column.Configuration.Title + " must not be an empty string",
                                'NULL': this.Column.Configuration.Title + " value is mandatory",
                                'REGEX': "Validation failed for " + this.Column.Configuration.Title,
                            };
                        };
                        return PlainTextEditor;
                    }(Reinforced.Lattice.Editing.EditorBase));
                    PlainText.PlainTextEditor = PlainTextEditor;
                    Lattice.ComponentsContainer.registerComponent('PlainTextEditor', PlainTextEditor);
                })(PlainText = Editors.PlainText || (Editors.PlainText = {}));
            })(Editors = Editing.Editors || (Editing.Editors = {}));
        })(Editing = Lattice.Editing || (Lattice.Editing = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Editing;
        (function (Editing) {
            var Editors;
            (function (Editors) {
                var SelectList;
                (function (SelectList) {
                    var SelectListEditor = (function (_super) {
                        __extends(SelectListEditor, _super);
                        function SelectListEditor() {
                            return _super !== null && _super.apply(this, arguments) || this;
                        }
                        SelectListEditor.prototype.getValue = function (errors) {
                            var selectedOption = this.List.options.item(this.List.selectedIndex);
                            var item = selectedOption == null ? '' : selectedOption.value.toString();
                            var value = null;
                            if (item.length === 0) {
                                if (this.Column.IsString && this.Configuration.AllowEmptyString)
                                    value = item;
                                else {
                                    if (this.Column.Configuration.IsNullable)
                                        value = null;
                                    else {
                                        errors.push({ Code: 'NULLVALUE' });
                                    }
                                }
                            }
                            else {
                                if (this.Column.IsEnum || this.Column.IsInteger)
                                    value = parseInt(item);
                                else if (this.Column.IsFloat)
                                    value = parseFloat(item);
                                else if (this.Column.IsBoolean)
                                    value = item.toUpperCase() === 'TRUE';
                                else if (this.Column.IsDateTime)
                                    value = this.MasterTable.Date.parse(item);
                                else if (this.Column.IsString)
                                    value = item.toString();
                                else
                                    errors.push({ Code: 'UNKNOWN' });
                            }
                            return value;
                        };
                        SelectListEditor.prototype.setValue = function (value) {
                            if (!this.List)
                                return;
                            var strvalue = this.Column.IsDateTime ? this.MasterTable.Date.serialize(value) : (value == null ? null : value.toString());
                            var isSet = false;
                            for (var i = 0; i < this.List.options.length; i++) {
                                if (this.List.options.item(i).value === strvalue) {
                                    this.List.options.item(i).selected = true;
                                    isSet = true;
                                    if (this.IsInitialValueSetting)
                                        Reinforced.Lattice.Master.fireDomEvent('change', this.List);
                                }
                            }
                            if (this.IsInitialValueSetting) {
                                if ((!isSet) &&
                                    this.Configuration.MissingKeyFunction != null &&
                                    this.Configuration.MissingValueFunction != null) {
                                    strvalue = this.Configuration.MissingKeyFunction(this.DataObject);
                                    if (strvalue != null) {
                                        strvalue = strvalue.toString();
                                        var text = this.Configuration.MissingValueFunction(this.DataObject).toString();
                                        var e = document.createElement('option');
                                        e.value = strvalue;
                                        e.text = text;
                                        e.selected = true;
                                        this.List.add(e);
                                        this.SelectedItem = {
                                            Value: strvalue,
                                            Disabled: false,
                                            Selected: true,
                                            Text: text
                                        };
                                        Reinforced.Lattice.Master.fireDomEvent('change', this.List);
                                    }
                                }
                            }
                            if (isSet) {
                                for (var i = 0; i < this.Items.length; i++) {
                                    if (this.Items[i].Value == strvalue) {
                                        this.SelectedItem = this.Items[i];
                                        break;
                                    }
                                }
                            }
                            this.VisualStates.mixinState('selected');
                        };
                        SelectListEditor.prototype.onStateChange = function (e) {
                            if (e.State !== 'selected' && e.State !== 'saving') {
                                this.VisualStates.mixinState('selected');
                            }
                        };
                        SelectListEditor.prototype.init = function (masterTable) {
                            _super.prototype.init.call(this, masterTable);
                            this.Items = this.Configuration.SelectListItems;
                            if (this.Configuration.AddEmptyElement) {
                                var empty = {
                                    Text: this.Configuration.EmptyElementText,
                                    Value: '',
                                    Disabled: false,
                                    Selected: false
                                };
                                this.Items = [empty].concat(this.Items);
                            }
                        };
                        SelectListEditor.prototype.renderContent = function (p) {
                            this.defaultRender(p);
                        };
                        SelectListEditor.prototype.onAfterRender = function (e) {
                            if (this.VisualStates) {
                                this.VisualStates.subscribeStateChange(this.onStateChange.bind(this));
                            }
                        };
                        SelectListEditor.prototype.changedHandler = function (e) {
                            _super.prototype.changedHandler.call(this, e);
                            var item = this.List.options.item(this.List.selectedIndex).value;
                            for (var i = 0; i < this.Items.length; i++) {
                                if (this.Items[i].Value == item) {
                                    this.SelectedItem = this.Items[i];
                                    break;
                                }
                            }
                            this.VisualStates.mixinState('selected');
                        };
                        SelectListEditor.prototype.focus = function () {
                            this.List.focus();
                        };
                        SelectListEditor.prototype.defineMessages = function () {
                            return {
                                'NULLVALUE': "Value must be provided for " + this.Column.Configuration.Title,
                                'UNKNOWN': "Unknown value for " + this.Column.Configuration.Title
                            };
                        };
                        return SelectListEditor;
                    }(Reinforced.Lattice.Editing.EditorBase));
                    SelectList.SelectListEditor = SelectListEditor;
                    Lattice.ComponentsContainer.registerComponent('SelectListEditor', SelectListEditor);
                })(SelectList = Editors.SelectList || (Editors.SelectList = {}));
            })(Editors = Editing.Editors || (Editing.Editors = {}));
        })(Editing = Lattice.Editing || (Lattice.Editing = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Editing;
        (function (Editing) {
            var Form;
            (function (Form) {
                var FormEditHandler = (function (_super) {
                    __extends(FormEditHandler, _super);
                    function FormEditHandler() {
                        var _this = _super !== null && _super.apply(this, arguments) || this;
                        _this._activeEditors = [];
                        return _this;
                    }
                    FormEditHandler.prototype.ensureEditing = function (rowDisplayIndex) {
                        if (this._isEditing)
                            return;
                        var lookup = this.MasterTable.DataHolder.StoredCache[rowDisplayIndex];
                        this.ensureEditingObject(lookup);
                    };
                    FormEditHandler.prototype.ensureEditingObject = function (dataObject) {
                        this.DataObject = dataObject;
                        this.CurrentDataObjectModified = {};
                        for (var cd in this.DataObject) {
                            if (this.DataObject.hasOwnProperty(cd)) {
                                this.CurrentDataObjectModified[cd] = this.DataObject[cd];
                            }
                        }
                        this._isEditing = true;
                    };
                    FormEditHandler.prototype.add = function () {
                        if (this._isEditing) {
                            this.rejectAll();
                        }
                        this.DataObject = this.MasterTable.DataHolder.defaultObject();
                        this.CurrentDataObjectModified = this.MasterTable.DataHolder.defaultObject();
                        for (var i = 0; i < this.Configuration.Fields.length; i++) {
                            if (this.Configuration.Fields[i].PluginId !== 'DisplayEditor') {
                                this.DataObject[this.Configuration.Fields[i].FieldName] = null;
                                this.CurrentDataObjectModified[this.Configuration.Fields[i].FieldName] = null;
                            }
                        }
                        this.startupForm();
                    };
                    FormEditHandler.prototype.beginEdit = function (dataObject) {
                        if (this._isEditing) {
                            this.rejectAll();
                        }
                        this.ensureEditing(dataObject);
                        this.startupForm();
                    };
                    FormEditHandler.prototype.beginFormEditHandler = function (e) {
                        if (this._isEditing) {
                            var lookup = this.MasterTable.DataHolder.StoredCache[e.Row];
                            if (this.DataObject !== lookup) {
                                this.rejectAll();
                            }
                        }
                        this.ensureEditing(e.Row);
                        this.startupForm();
                    };
                    FormEditHandler.prototype.startupForm = function () {
                        this.MasterTable.Events.Edit.invokeBefore(this, this.CurrentDataObjectModified);
                        var vm = new FormEditFormModel();
                        this._activeEditors = [];
                        for (var i = 0; i < this.Configuration.Fields.length; i++) {
                            var editorConf = this.Configuration.Fields[i];
                            var column = null;
                            if (editorConf.FakeColumn != null) {
                                column = Reinforced.Lattice.Services.InstanceManagerService.createColumn(editorConf.FakeColumn, this.MasterTable);
                            }
                            else {
                                column = this.MasterTable.InstanceManager.Columns[editorConf.FieldName];
                            }
                            var editor = this.createEditor(editorConf.FieldName, column, false, Editing.EditorMode.Form);
                            this._activeEditors.push(editor);
                            vm.EditorsSet[editorConf.FieldName] = editor;
                            vm.ActiveEditors.push(editor);
                        }
                        vm.DataObject = this.DataObject;
                        vm.Handler = this;
                        this._currentForm = vm;
                        this._currentFormElement = this.MasterTable.Renderer.renderObject(this.Configuration.FormTemplateId, vm, this.Configuration.FormTargetSelector);
                        vm.RootElement = this._currentFormElement;
                        this.stripNotRenderedEditors();
                        for (var j = 0; j < this._activeEditors.length; j++) {
                            this.setEditorValue(this._activeEditors[j]);
                        }
                    };
                    FormEditHandler.prototype.stripNotRenderedEditors = function () {
                        var newEditors = [];
                        for (var i = 0; i < this._activeEditors.length; i++) {
                            if (this._activeEditors[i]["_IsRendered"])
                                newEditors.push(this._activeEditors[i]);
                        }
                        if (newEditors.length === this._activeEditors.length)
                            return;
                        this._activeEditors = newEditors;
                    };
                    FormEditHandler.prototype.commitAll = function () {
                        var _this = this;
                        this.ValidationMessages = [];
                        var errors = [];
                        for (var i = 0; i < this._activeEditors.length; i++) {
                            this.retrieveEditorData(this._activeEditors[i], errors);
                        }
                        this.ValidationMessages = errors;
                        if (this.ValidationMessages.length > 0) {
                            this.MasterTable.Events.EditValidationFailed.invokeAfter(this, {
                                OriginalDataObject: this.DataObject,
                                ModifiedDataObject: this.CurrentDataObjectModified,
                                Messages: this.ValidationMessages
                            });
                            return;
                        }
                        this._isEditing = false;
                        for (var i = 0; i < this._activeEditors.length; i++) {
                            if (this._activeEditors[i].VisualStates != null)
                                this._activeEditors[i].VisualStates.changeState('saving');
                        }
                        if (this.VisualStates != null)
                            this.VisualStates.changeState('saving');
                        this._isEditing = false;
                        this.sendDataObjectToServer(function () {
                            if (!_this._isEditing) {
                                _this.MasterTable.Events.Edit.invokeAfter(_this, _this.CurrentDataObjectModified);
                                _this.CurrentDataObjectModified = null;
                                _this.MasterTable.Renderer.Modifier.cleanSelector(_this.Configuration.FormTargetSelector);
                                _this._currentFormElement = null;
                                _this._currentForm = null;
                                _this._activeEditors = [];
                                if (_this.VisualStates != null)
                                    _this.VisualStates.normalState();
                            }
                        }, function (_) {
                            for (var i = 0; i < _this._activeEditors.length; i++) {
                                if (_this._activeEditors[i].VisualStates != null)
                                    _this._activeEditors[i].VisualStates.normalState();
                            }
                            if (_this.VisualStates != null)
                                _this.VisualStates.normalState();
                        });
                    };
                    FormEditHandler.prototype.rejectAll = function () {
                        for (var i = 0; i < this._activeEditors.length; i++) {
                            this.reject(this._activeEditors[i]);
                        }
                        this._isEditing = false;
                        this.CurrentDataObjectModified = null;
                        this.MasterTable.Renderer.Modifier.cleanSelector(this.Configuration.FormTargetSelector);
                        this._currentFormElement = null;
                        this._currentForm = null;
                    };
                    FormEditHandler.prototype.notifyChanged = function (editor) {
                        this.retrieveEditorData(editor);
                        for (var i = 0; i < this._activeEditors.length; i++) {
                            this._activeEditors[i].notifyObjectChanged();
                        }
                    };
                    FormEditHandler.prototype.commit = function (editor) {
                        var idx = this._activeEditors.indexOf(editor);
                        if (this._activeEditors.length > idx + 1) {
                            idx = -1;
                            for (var i = 0; i < this._activeEditors.length; i++) {
                                if (!this._activeEditors[i].IsValid) {
                                    idx = i;
                                    break;
                                }
                            }
                            if (idx !== -1)
                                this._activeEditors[idx].focus();
                        }
                    };
                    FormEditHandler.prototype.onAdjustment = function (e) { };
                    FormEditHandler.prototype.reject = function (editor) {
                        if (this.CurrentDataObjectModified != null) {
                            this.CurrentDataObjectModified[editor.FieldName] = this.DataObject[editor.FieldName];
                            this.setEditorValue(editor);
                        }
                    };
                    return FormEditHandler;
                }(Reinforced.Lattice.Editing.EditHandlerBase));
                Form.FormEditHandler = FormEditHandler;
                var FormEditFormModel = (function () {
                    function FormEditFormModel() {
                        this.EditorsSet = {};
                        this.ActiveEditors = [];
                    }
                    FormEditFormModel.prototype.Editors = function (p) {
                        for (var i = 0; i < this.ActiveEditors.length; i++) {
                            this.editor(p, this.ActiveEditors[i]);
                        }
                    };
                    FormEditFormModel.prototype.editor = function (p, editor) {
                        editor['_IsRendered'] = true;
                        editor.renderContent(p);
                    };
                    FormEditFormModel.prototype.Editor = function (p, fieldName) {
                        var editor = this.EditorsSet[fieldName];
                        if (editor == null || editor == undefined)
                            return;
                        this.editor(p, editor);
                    };
                    FormEditFormModel.prototype.commit = function () {
                        this.Handler.commitAll();
                    };
                    FormEditFormModel.prototype.reject = function () {
                        this.Handler.rejectAll();
                    };
                    return FormEditFormModel;
                }());
                Form.FormEditFormModel = FormEditFormModel;
                Lattice.ComponentsContainer.registerComponent('FormEditHandler', FormEditHandler);
            })(Form = Editing.Form || (Editing.Form = {}));
        })(Editing = Lattice.Editing || (Lattice.Editing = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Editing;
        (function (Editing) {
            var Editors;
            (function (Editors) {
                var Cells;
                (function (Cells) {
                    var RowsEditHandler = (function (_super) {
                        __extends(RowsEditHandler, _super);
                        function RowsEditHandler() {
                            var _this = _super !== null && _super.apply(this, arguments) || this;
                            _this._isEditing = false;
                            _this._activeEditors = [];
                            _this._isAddingNewRow = false;
                            _this.afterDrawn = function (e) {
                                _this.MasterTable.Events.DataRendered.subscribeAfter(_this.onAfterRender.bind(_this), 'roweditor');
                            };
                            _this._isRedrawnByAdjustment = false;
                            return _this;
                        }
                        RowsEditHandler.prototype.onAfterRender = function (e) {
                            if (!this._isEditing)
                                return;
                            for (var i = 0; i < this._activeEditors.length; i++) {
                                this._activeEditors[i].onAfterRender(null);
                                this.setEditorValue(this._activeEditors[i]);
                            }
                        };
                        RowsEditHandler.prototype.ensureEditing = function (rowIndex) {
                            if (this._isEditing)
                                return;
                            if (rowIndex >= 0) {
                                this._isAddingNewRow = false;
                                this.DataObject = this.MasterTable.DataHolder.StoredCache[rowIndex];
                                this.DisplayIndex = this.MasterTable.DataHolder.DisplayedData.indexOf(this.DataObject);
                                var isLast = this.MasterTable.DataHolder.DisplayedData.length == 0
                                    ? true
                                    : (this.MasterTable.DataHolder.DisplayedData[this.MasterTable.DataHolder.DisplayedData.length - 1] ==
                                        this.DataObject);
                                this.IsLast = isLast;
                                this.CurrentDataObjectModified = {};
                                for (var cd in this.DataObject) {
                                    if (this.DataObject.hasOwnProperty(cd)) {
                                        this.CurrentDataObjectModified[cd] = this.DataObject[cd];
                                    }
                                }
                            }
                            else {
                                this._isAddingNewRow = true;
                                this.DataObject = this.MasterTable.DataHolder.defaultObject();
                                this.CurrentDataObjectModified = this.MasterTable.DataHolder.defaultObject();
                                for (var i = 0; i < this.Configuration.Fields.length; i++) {
                                    if (this.Configuration.Fields[i].PluginId !== 'DisplayEditor') {
                                        this.DataObject[this.Configuration.Fields[i].FieldName] = null;
                                        this.CurrentDataObjectModified[this.Configuration.Fields[i].FieldName] = null;
                                    }
                                }
                            }
                            this.MasterTable.Events.Edit.invokeBefore(this, this.CurrentDataObjectModified);
                            var row = this.MasterTable.Controller.produceRow(this.DataObject);
                            this.Cells = row.Cells;
                            this.Index = rowIndex < 0 ? -1 : rowIndex;
                            this._activeEditors = [];
                            this._isEditing = true;
                        };
                        RowsEditHandler.prototype.beginRowEdit = function (rowIndex) {
                            if (this._isEditing) {
                                var lookup = this.MasterTable.DataHolder.StoredCache[rowIndex];
                                if (this.DataObject !== lookup) {
                                    this.rejectAll();
                                }
                            }
                            this.ensureEditing(rowIndex);
                            for (var k in this.Cells) {
                                if (this.Cells.hasOwnProperty(k)) {
                                    if (!this.isEditable(this.Cells[k].Column)) {
                                        this.Cells[k]['IsEditing'] = true;
                                        continue;
                                    }
                                    var columnName = this.Cells[k].Column.RawName;
                                    var editor = this.createEditor(this.Cells[k].Column.RawName, this.Cells[k].Column, false, Editing.EditorMode.Row);
                                    this.Cells[columnName] = editor;
                                    this._activeEditors.push(editor);
                                }
                            }
                            if (rowIndex < 0) {
                                this.MasterTable.Renderer.Modifier.prependRow(this);
                            }
                            else {
                                this.MasterTable.Renderer.Modifier.redrawRow(this);
                            }
                            for (var i = 0; i < this._activeEditors.length; i++) {
                                this.setEditorValue(this._activeEditors[i]);
                            }
                            if (this._activeEditors.length > 0)
                                this._activeEditors[0].focus();
                        };
                        RowsEditHandler.prototype.commitAll = function () {
                            var _this = this;
                            this.ValidationMessages = [];
                            var errors = [];
                            for (var i = 0; i < this._activeEditors.length; i++) {
                                this.retrieveEditorData(this._activeEditors[i], errors);
                            }
                            this.ValidationMessages = errors;
                            if (this.ValidationMessages.length > 0) {
                                this.MasterTable.Events.EditValidationFailed.invokeAfter(this, {
                                    OriginalDataObject: this.DataObject,
                                    ModifiedDataObject: this.CurrentDataObjectModified,
                                    Messages: this.ValidationMessages
                                });
                                return;
                            }
                            for (var i = 0; i < this._activeEditors.length; i++) {
                                if (this._activeEditors[i].VisualStates != null)
                                    this._activeEditors[i].VisualStates.changeState('saving');
                            }
                            this._isRedrawnByAdjustment = false;
                            this.sendDataObjectToServer(function () {
                                _this.MasterTable.Events.Edit.invokeAfter(_this, _this.CurrentDataObjectModified);
                                if (!_this._isRedrawnByAdjustment) {
                                    var obj = _this.MasterTable.DataHolder.getByPrimaryKey(_this.CurrentDataObjectModified['__key']);
                                    if (!obj) {
                                        for (var i = 0; i < _this._activeEditors.length; i++) {
                                            if (_this._activeEditors[i].VisualStates != null)
                                                _this._activeEditors[i].VisualStates.normalState();
                                        }
                                    }
                                    else {
                                        _this.MasterTable.Controller.redrawVisibleDataObject(obj);
                                        _this.CurrentDataObjectModified = null;
                                        _this._isEditing = false;
                                    }
                                }
                            }, function (_) {
                                for (var i = 0; i < _this._activeEditors.length; i++) {
                                    if (_this._activeEditors[i].VisualStates != null)
                                        _this._activeEditors[i].VisualStates.normalState();
                                }
                            });
                        };
                        RowsEditHandler.prototype.commit = function (editor) {
                            var idx = this._activeEditors.indexOf(editor);
                            if (this._activeEditors.length > idx + 1) {
                                idx = -1;
                                for (var i = 0; i < this._activeEditors.length; i++) {
                                    if (!this._activeEditors[i].IsValid) {
                                        idx = i;
                                        break;
                                    }
                                }
                                if (idx !== -1)
                                    this._activeEditors[idx].focus();
                            }
                        };
                        RowsEditHandler.prototype.notifyChanged = function (editor) {
                            this.retrieveEditorData(editor);
                            for (var i = 0; i < this._activeEditors.length; i++) {
                                this._activeEditors[i].notifyObjectChanged();
                            }
                        };
                        RowsEditHandler.prototype.rejectAll = function () {
                            for (var i = 0; i < this._activeEditors.length; i++) {
                                this.reject(this._activeEditors[i]);
                            }
                            this._isEditing = false;
                            this.CurrentDataObjectModified = null;
                            this.Cells = {};
                            if (!this._isAddingNewRow) {
                                var di = this.MasterTable.DataHolder.localLookupDisplayedDataObject(this.DataObject);
                                if (di.IsCurrentlyDisplaying) {
                                    this.MasterTable.Controller.redrawVisibleDataObject(this.DataObject);
                                }
                            }
                            else {
                                this.MasterTable.Renderer.Modifier.destroyRow(this);
                            }
                        };
                        RowsEditHandler.prototype.reject = function (editor) {
                            this.CurrentDataObjectModified[editor.FieldName] = this.DataObject[editor.FieldName];
                            this.setEditorValue(editor);
                        };
                        RowsEditHandler.prototype.add = function () {
                            this.beginRowEdit(-1);
                        };
                        RowsEditHandler.prototype.beginRowEditHandle = function (e) {
                            this.beginRowEdit(e.Row);
                        };
                        RowsEditHandler.prototype.commitRowEditHandle = function (e) {
                            if (!this._isEditing)
                                return;
                            this.commitAll();
                        };
                        RowsEditHandler.prototype.rejectRowEditHandle = function (e) {
                            if (!this._isEditing)
                                return;
                            this.rejectAll();
                        };
                        RowsEditHandler.prototype.provide = function (rows) {
                            if (!this._isEditing)
                                return;
                            for (var i = 0; i < rows.length; i++) {
                                if (rows[i].DataObject['__key'] === this.DataObject['__key']) {
                                    rows[i] = this;
                                }
                            }
                        };
                        RowsEditHandler.prototype.onAdjustment = function (e) {
                            if (!this._isEditing)
                                return;
                            var obj = this.MasterTable.DataHolder.getByPrimaryKey(this.CurrentDataObjectModified['__key']);
                            var isAdded = e.EventArgs.AddedData.indexOf(obj) > -1;
                            var isUpdated = e.EventArgs.TouchedData.indexOf(obj) > -1;
                            this._isRedrawnByAdjustment = isAdded || isUpdated;
                        };
                        RowsEditHandler.prototype.init = function (masterTable) {
                            _super.prototype.init.call(this, masterTable);
                            masterTable.Controller.registerAdditionalRowsProvider(this);
                        };
                        return RowsEditHandler;
                    }(Editing.EditHandlerBase));
                    Cells.RowsEditHandler = RowsEditHandler;
                    Lattice.ComponentsContainer.registerComponent('RowsEditHandler', RowsEditHandler);
                })(Cells = Editors.Cells || (Editors.Cells = {}));
            })(Editors = Editing.Editors || (Editing.Editors = {}));
        })(Editing = Lattice.Editing || (Lattice.Editing = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Filters;
        (function (Filters) {
            var FilterBase = (function (_super) {
                __extends(FilterBase, _super);
                function FilterBase() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                FilterBase.prototype.precompute = function (query, context) {
                    throw new Error('Please override this method');
                };
                FilterBase.prototype.modifyQuery = function (query, scope) { };
                FilterBase.prototype.init = function (masterTable) {
                    _super.prototype.init.call(this, masterTable);
                    this.MasterTable.Loader.registerQueryPartProvider(this);
                };
                FilterBase.prototype.itIsClientFilter = function () {
                    this.MasterTable.DataHolder.registerClientFilter(this);
                };
                FilterBase.prototype.filterPredicate = function (rowObject, context, query) { throw new Error('Please override this method'); };
                return FilterBase;
            }(Reinforced.Lattice.Plugins.PluginBase));
            Filters.FilterBase = FilterBase;
        })(Filters = Lattice.Filters || (Lattice.Filters = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Filters;
        (function (Filters) {
            var Range;
            (function (Range) {
                var RangeFilterPlugin = (function (_super) {
                    __extends(RangeFilterPlugin, _super);
                    function RangeFilterPlugin() {
                        var _this = _super !== null && _super.apply(this, arguments) || this;
                        _this._filteringIsBeingExecuted = false;
                        _this._isInitializing = true;
                        _this.afterDrawn = function (e) {
                            if (_this.Configuration.Hidden)
                                return;
                            if (_this.AssociatedColumn.IsDateTime) {
                                var fromDate = _this.MasterTable.Date.parse(_this.Configuration.FromValue);
                                var toDate = _this.MasterTable.Date.parse(_this.Configuration.ToValue);
                                _this.MasterTable.Date.putDateToDatePicker(_this.FromValueProvider, fromDate);
                                _this.MasterTable.Date.putDateToDatePicker(_this.ToValueProvider, toDate);
                            }
                            _this._isInitializing = false;
                        };
                        return _this;
                    }
                    RangeFilterPlugin.prototype.getFromValue = function () {
                        if (this.AssociatedColumn.Configuration.IsDataOnly) {
                            return this.Configuration.FromValue;
                        }
                        if (!this.FromValueProvider)
                            return '';
                        if (this.AssociatedColumn.IsDateTime) {
                            var date = this.MasterTable.Date.getDateFromDatePicker(this.FromValueProvider);
                            return this.MasterTable.Date.serialize(date);
                        }
                        return this.FromValueProvider.value;
                    };
                    RangeFilterPlugin.prototype.getToValue = function () {
                        if (this.AssociatedColumn.Configuration.IsDataOnly) {
                            return this.Configuration.ToValue;
                        }
                        if (!this.ToValueProvider)
                            return '';
                        if (this.AssociatedColumn.IsDateTime) {
                            var date = this.MasterTable.Date.getDateFromDatePicker(this.ToValueProvider);
                            return this.MasterTable.Date.serialize(date);
                        }
                        return this.ToValueProvider.value;
                    };
                    RangeFilterPlugin.prototype.handleValueChanged = function () {
                        var _this = this;
                        if (this._isInitializing)
                            return;
                        if (this._filteringIsBeingExecuted)
                            return;
                        if ((this._fromPreviousValue === this.getFromValue())
                            && (this._toPreviousValue === this.getToValue()))
                            return;
                        this._fromPreviousValue = this.getFromValue();
                        this._toPreviousValue = this.getToValue();
                        if (this.Configuration.InputDelay > 0) {
                            clearTimeout(this._inpTimeout);
                            this._inpTimeout = setTimeout(function () {
                                _this._filteringIsBeingExecuted = true;
                                _this.MasterTable.Controller.reload();
                                _this._filteringIsBeingExecuted = false;
                            }, this.Configuration.InputDelay);
                        }
                        else {
                            this._filteringIsBeingExecuted = true;
                            this.MasterTable.Controller.reload();
                            this._filteringIsBeingExecuted = false;
                        }
                    };
                    RangeFilterPlugin.prototype.getFilterArgument = function () {
                        var args = [];
                        var frm = this.getFromValue();
                        var to = this.getToValue();
                        args.push(frm);
                        args.push(to);
                        var result = args.join('|');
                        return result;
                    };
                    RangeFilterPlugin.prototype.modifyQuery = function (query, scope) {
                        if (this.Configuration.Hidden)
                            return;
                        var val = this.getFilterArgument();
                        if (!val || val.length === 0)
                            return;
                        if (this.Configuration.ClientFiltering && scope === Lattice.QueryScope.Client || scope === Lattice.QueryScope.Transboundary) {
                            query.Filterings[this.AssociatedColumn.RawName] = val;
                        }
                        if ((!this.Configuration.ClientFiltering) && scope === Lattice.QueryScope.Server || scope === Lattice.QueryScope.Transboundary) {
                            query.Filterings[this.AssociatedColumn.RawName] = val;
                        }
                    };
                    RangeFilterPlugin.prototype.init = function (masterTable) {
                        _super.prototype.init.call(this, masterTable);
                        if (this.Configuration.ClientFiltering) {
                            this.itIsClientFilter();
                        }
                        this.AssociatedColumn = this.MasterTable.InstanceManager.Columns[this.Configuration.ColumnName];
                    };
                    RangeFilterPlugin.prototype.renderContent = function (p) {
                        if (this.Configuration.Hidden)
                            return;
                        this.defaultRender(p);
                    };
                    RangeFilterPlugin.prototype.precompute = function (query, context) {
                        var fval = query.Filterings[this.AssociatedColumn.RawName];
                        if (!fval)
                            return;
                        var args = fval.split('|');
                        var fromValue = args[0];
                        var toValue = args[1];
                        var entry = {
                            HasFrom: fromValue.trim().length !== 0,
                            HasTo: toValue.trim().length !== 0,
                            IncludeLeft: this.Configuration.InclusiveLeft,
                            IncludeRight: this.Configuration.InclusiveRight,
                            From: fromValue,
                            To: toValue
                        };
                        if (!entry.HasFrom && !entry.HasTo)
                            return;
                        if (this.AssociatedColumn.IsFloat) {
                            entry.From = entry.HasFrom ? parseFloat(entry.From) : null;
                            entry.To = entry.HasTo ? parseFloat(entry.To) : null;
                        }
                        if (this.AssociatedColumn.IsInteger || this.AssociatedColumn.IsEnum) {
                            entry.From = entry.HasFrom ? parseInt(entry.From) : null;
                            entry.To = entry.HasTo ? parseInt(entry.To) : null;
                        }
                        if (this.AssociatedColumn.IsDateTime) {
                            entry.From = entry.HasFrom ? this.MasterTable.Date.parse(entry.From) : null;
                            entry.To = entry.HasTo ? this.MasterTable.Date.parse(entry.To) : null;
                            if (this.Configuration.CompareOnlyDates) {
                                if (entry.HasFrom) {
                                    entry.From.setHours(0, 0, 0, 0);
                                    if (!entry.IncludeLeft) {
                                        entry.From.setDate(entry.From.getDate() + 1);
                                        entry.IncludeLeft = true;
                                    }
                                }
                                if (entry.HasTo) {
                                    entry.To.setHours(0, 0, 0, 0);
                                    if (entry.IncludeRight) {
                                        entry.To.setDate(entry.To.getDate() + 1);
                                        entry.IncludeRight = false;
                                    }
                                }
                            }
                        }
                        context[this.AssociatedColumn.RawName] = entry;
                    };
                    RangeFilterPlugin.prototype.filterPredicate = function (rowObject, context, query) {
                        if (!context.hasOwnProperty(this.AssociatedColumn.RawName))
                            return true;
                        var entry = context[this.AssociatedColumn.RawName];
                        if (this.Configuration.ClientFilteringFunction) {
                            return this.Configuration.ClientFilteringFunction(rowObject, entry, query);
                        }
                        var objVal = rowObject[this.AssociatedColumn.RawName];
                        if (objVal == null)
                            return false;
                        if (this.AssociatedColumn.IsString) {
                            var str = objVal.toString();
                            return ((!entry.HasFrom) ||
                                (entry.IncludeLeft
                                    ? (str.localeCompare(entry.From) >= 0)
                                    : (str.localeCompare(entry.From) > 0)))
                                && ((!entry.HasTo) ||
                                    (entry.IncludeRight
                                        ? (str.localeCompare(entry.To) <= 0)
                                        : (str.localeCompare(entry.To) < 0)));
                        }
                        return ((!entry.HasFrom) ||
                            (entry.IncludeLeft
                                ? (objVal >= entry.From)
                                : (objVal > entry.From)))
                            && ((!entry.HasTo) ||
                                (this.Configuration.InclusiveRight
                                    ? (objVal <= entry.To)
                                    : (objVal < entry.To)));
                    };
                    return RangeFilterPlugin;
                }(Reinforced.Lattice.Filters.FilterBase));
                Range.RangeFilterPlugin = RangeFilterPlugin;
                Lattice.ComponentsContainer.registerComponent('RangeFilter', RangeFilterPlugin);
            })(Range = Filters.Range || (Filters.Range = {}));
        })(Filters = Lattice.Filters || (Lattice.Filters = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Filters;
        (function (Filters) {
            var Select;
            (function (Select) {
                var SelectFilterPlugin = (function (_super) {
                    __extends(SelectFilterPlugin, _super);
                    function SelectFilterPlugin() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    SelectFilterPlugin.prototype.getSerializedValue = function () {
                        if (this.AssociatedColumn.Configuration.IsDataOnly && this.Configuration.SelectedValue) {
                            return this.Configuration.SelectedValue;
                        }
                        return this.getArrayValue().join('|');
                    };
                    SelectFilterPlugin.prototype.getArrayValue = function () {
                        if (!this.FilterValueProvider)
                            return [];
                        if (!this.Configuration.IsMultiple) {
                            var selected = this.FilterValueProvider.options[this.FilterValueProvider.selectedIndex];
                            return [selected.value];
                        }
                        else {
                            var elemValues = [];
                            for (var i = 0, iLen = this.FilterValueProvider.options.length; i < iLen; i++) {
                                var opt = this.FilterValueProvider.options[i];
                                if (opt.selected) {
                                    elemValues.push(opt.value);
                                }
                            }
                            return elemValues;
                        }
                    };
                    SelectFilterPlugin.prototype.modifyQuery = function (query, scope) {
                        if (this.Configuration.Hidden)
                            return;
                        var val = this.getSerializedValue();
                        if (!val || val.length === 0)
                            return;
                        if (this.Configuration.ClientFiltering && scope === Lattice.QueryScope.Client || scope === Lattice.QueryScope.Transboundary) {
                            query.Filterings[this.AssociatedColumn.RawName] = val;
                        }
                        if ((!this.Configuration.ClientFiltering) && scope === Lattice.QueryScope.Server || scope === Lattice.QueryScope.Transboundary) {
                            query.Filterings[this.AssociatedColumn.RawName] = val;
                        }
                    };
                    SelectFilterPlugin.prototype.renderContent = function (p) {
                        if (this.Configuration.Hidden)
                            return;
                        this.defaultRender(p);
                    };
                    SelectFilterPlugin.prototype.handleValueChanged = function () {
                        this.MasterTable.Controller.reload();
                    };
                    SelectFilterPlugin.prototype.init = function (masterTable) {
                        _super.prototype.init.call(this, masterTable);
                        this.AssociatedColumn = this.MasterTable.InstanceManager.Columns[this.Configuration.ColumnName];
                        var sv = this.Configuration.SelectedValue;
                        if (sv !== undefined && sv !== null) {
                            for (var i = 0; i < this.Configuration.Items.length; i++) {
                                if (this.Configuration.Items[i].Value !== sv) {
                                    this.Configuration.Items[i].Selected = false;
                                }
                                else {
                                    this.Configuration.Items[i].Selected = true;
                                }
                            }
                        }
                        if (this.Configuration.ClientFiltering) {
                            this.itIsClientFilter();
                        }
                    };
                    SelectFilterPlugin.prototype.precompute = function (query, context) {
                        var fval = query.Filterings[this.AssociatedColumn.RawName];
                        if (fval == null || fval == undefined)
                            return;
                        if (fval === '$$lattice_not_present$$' && this.AssociatedColumn.Configuration.IsNullable)
                            fval = null;
                        var arr = null;
                        if (this.Configuration.IsMultiple) {
                            arr = fval != null ? fval.split('|') : [null];
                        }
                        else {
                            arr = [fval];
                        }
                        var result = [];
                        for (var i = 0; i < arr.length; i++) {
                            var v = arr[i];
                            if (v === null && this.AssociatedColumn.Configuration.IsNullable)
                                result.push(null);
                            else if (this.AssociatedColumn.IsString)
                                result.push(v);
                            else if (this.AssociatedColumn.IsFloat)
                                result.push(parseFloat(v));
                            else if (this.AssociatedColumn.IsInteger || this.AssociatedColumn.IsEnum)
                                result.push(parseInt(v));
                            else if (this.AssociatedColumn.IsBoolean) {
                                var bv = v.toLocaleUpperCase() === 'TRUE' ? true :
                                    v.toLocaleUpperCase() === 'FALSE' ? false : null;
                                if (bv == null) {
                                    bv = parseInt(v) > 0;
                                }
                                result.push(bv);
                            }
                        }
                        context[this.AssociatedColumn.RawName] = result;
                    };
                    SelectFilterPlugin.prototype.filterPredicate = function (rowObject, context, query) {
                        if (!context.hasOwnProperty(this.AssociatedColumn.RawName))
                            return true;
                        if (this.Configuration.ClientFilteringFunction) {
                            return this.Configuration.ClientFilteringFunction(rowObject, context[this.AssociatedColumn.RawName], query);
                        }
                        var arr = context[this.AssociatedColumn.RawName];
                        var objVal = rowObject[this.AssociatedColumn.RawName];
                        if (objVal == null)
                            return arr.indexOf(null) > -1;
                        if (this.AssociatedColumn.IsString
                            || this.AssociatedColumn.IsFloat
                            || this.AssociatedColumn.IsInteger
                            || this.AssociatedColumn.IsEnum
                            || this.AssociatedColumn.IsBoolean) {
                            return arr.indexOf(objVal) >= 0;
                        }
                        return true;
                    };
                    return SelectFilterPlugin;
                }(Reinforced.Lattice.Filters.FilterBase));
                Select.SelectFilterPlugin = SelectFilterPlugin;
                Lattice.ComponentsContainer.registerComponent('SelectFilter', SelectFilterPlugin);
            })(Select = Filters.Select || (Filters.Select = {}));
        })(Filters = Lattice.Filters || (Lattice.Filters = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Filters;
        (function (Filters) {
            var Value;
            (function (Value) {
                var ValueFilterPlugin = (function (_super) {
                    __extends(ValueFilterPlugin, _super);
                    function ValueFilterPlugin() {
                        var _this = _super !== null && _super.apply(this, arguments) || this;
                        _this._filteringIsBeingExecuted = false;
                        _this._isInitializing = true;
                        _this.afterDrawn = function (e) {
                            if (_this.Configuration.Hidden)
                                return;
                            if (_this.AssociatedColumn.IsDateTime) {
                                var date = _this.MasterTable.Date.parse(_this.Configuration.DefaultValue);
                                _this.MasterTable.Date.putDateToDatePicker(_this.FilterValueProvider, date);
                            }
                            _this._isInitializing = false;
                        };
                        return _this;
                    }
                    ValueFilterPlugin.prototype.getValue = function () {
                        if (this.AssociatedColumn.Configuration.IsDataOnly && this.Configuration.DefaultValue) {
                            return this.Configuration.DefaultValue;
                        }
                        if (!this.FilterValueProvider)
                            return '';
                        if (this.AssociatedColumn.IsDateTime) {
                            return this.MasterTable.Date.serialize(this.MasterTable.Date.getDateFromDatePicker(this.FilterValueProvider));
                        }
                        return this.FilterValueProvider.value;
                    };
                    ValueFilterPlugin.prototype.handleValueChanged = function () {
                        var _this = this;
                        if (this._isInitializing)
                            return;
                        if (this._filteringIsBeingExecuted)
                            return;
                        if (this.getValue() === this._previousValue) {
                            return;
                        }
                        this._previousValue = this.getValue();
                        if (this.Configuration.InputDelay > 0) {
                            clearTimeout(this._inpTimeout);
                            this._inpTimeout = setTimeout(function () {
                                _this._filteringIsBeingExecuted = true;
                                _this.MasterTable.Controller.reload();
                                _this._filteringIsBeingExecuted = false;
                            }, this.Configuration.InputDelay);
                        }
                        else {
                            this._filteringIsBeingExecuted = true;
                            this.MasterTable.Controller.reload();
                            this._filteringIsBeingExecuted = false;
                        }
                    };
                    ValueFilterPlugin.prototype.renderContent = function (p) {
                        if (this.Configuration.Hidden)
                            return;
                        this.defaultRender(p);
                    };
                    ValueFilterPlugin.prototype.init = function (masterTable) {
                        _super.prototype.init.call(this, masterTable);
                        if (this.Configuration.ClientFiltering) {
                            this.itIsClientFilter();
                        }
                        this.AssociatedColumn = this.MasterTable.InstanceManager.Columns[this.Configuration.ColumnName];
                    };
                    ValueFilterPlugin.prototype.precompute = function (query, context) {
                        var fval = query.Filterings[this.AssociatedColumn.RawName];
                        if (fval == null || fval == undefined)
                            return;
                        if (fval === '$$lattice_not_present$$' && this.AssociatedColumn.Configuration.IsNullable) {
                            fval = null;
                        }
                        if (this.AssociatedColumn.IsString) {
                            context[this.AssociatedColumn.RawName] = fval;
                            if (fval != null) {
                                context[this.AssociatedColumn.RawName + '$#_split'] = fval.split(/\s/);
                            }
                            return;
                        }
                        var val = fval;
                        if (fval == null)
                            val = null;
                        else if (this.AssociatedColumn.IsFloat)
                            val = parseFloat(fval);
                        else if (this.AssociatedColumn.IsInteger || this.AssociatedColumn.IsEnum)
                            val = parseInt(fval);
                        else if (this.AssociatedColumn.IsBoolean) {
                            var bv = fval.toLocaleUpperCase() === 'TRUE' ? true :
                                fval.toLocaleUpperCase() === 'FALSE' ? false : null;
                            if (bv == null) {
                                bv = parseInt(fval) > 0;
                            }
                            val = bv;
                        }
                        else if (this.AssociatedColumn.IsDateTime)
                            val = this.MasterTable.Date.parse(fval);
                        context[this.AssociatedColumn.RawName] = val;
                    };
                    ValueFilterPlugin.prototype.filterPredicate = function (rowObject, context, query) {
                        if (!context.hasOwnProperty(this.AssociatedColumn.RawName))
                            return true;
                        if (this.Configuration.ClientFilteringFunction) {
                            return this.Configuration.ClientFilteringFunction(rowObject, context[this.AssociatedColumn.RawName], query);
                        }
                        var objVal = rowObject[this.AssociatedColumn.RawName];
                        if (objVal == null)
                            return context[this.AssociatedColumn.RawName] == null;
                        if (this.AssociatedColumn.IsString) {
                            objVal = objVal.toString();
                            var entries = context[this.AssociatedColumn.RawName + '$#_split'];
                            for (var i = 0; i < entries.length; i++) {
                                var e = entries[i].trim();
                                if (e.length > 0) {
                                    if (objVal.toLocaleLowerCase().indexOf(e.toLocaleLowerCase()) < 0)
                                        return false;
                                }
                            }
                            return true;
                        }
                        if (this.AssociatedColumn.IsFloat
                            || this.AssociatedColumn.IsInteger
                            || this.AssociatedColumn.IsEnum
                            || this.AssociatedColumn.IsBoolean) {
                            return objVal === context[this.AssociatedColumn.RawName];
                        }
                        if (this.AssociatedColumn.IsDateTime) {
                            var date = context[this.AssociatedColumn.RawName];
                            if (this.Configuration.CompareOnlyDates) {
                                return date.getFullYear() === objVal.getFullYear()
                                    && date.getDate() === objVal.getDate()
                                    && date.getMonth() === objVal.getMonth();
                            }
                            return date === objVal;
                        }
                        return true;
                    };
                    ValueFilterPlugin.prototype.modifyQuery = function (query, scope) {
                        if (this.Configuration.Hidden)
                            return;
                        var val = this.getValue();
                        if (!val || val.length === 0)
                            return;
                        if (this.Configuration.ClientFiltering && scope === Lattice.QueryScope.Client || scope === Lattice.QueryScope.Transboundary) {
                            query.Filterings[this.AssociatedColumn.RawName] = val;
                        }
                        if ((!this.Configuration.ClientFiltering) && scope === Lattice.QueryScope.Server || scope === Lattice.QueryScope.Transboundary) {
                            query.Filterings[this.AssociatedColumn.RawName] = val;
                        }
                    };
                    return ValueFilterPlugin;
                }(Reinforced.Lattice.Filters.FilterBase));
                Value.ValueFilterPlugin = ValueFilterPlugin;
                Lattice.ComponentsContainer.registerComponent('ValueFilter', ValueFilterPlugin);
            })(Value = Filters.Value || (Filters.Value = {}));
        })(Filters = Lattice.Filters || (Lattice.Filters = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Plugins;
        (function (Plugins) {
            var Checkboxify;
            (function (Checkboxify) {
                var CheckboxifyPlugin = (function (_super) {
                    __extends(CheckboxifyPlugin, _super);
                    function CheckboxifyPlugin() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    CheckboxifyPlugin.prototype.redrawHeader = function () {
                        this._ourColumn.Header['IsAllSelected'] = this.MasterTable.Selection.isAllSelected();
                        this._ourColumn.Header['CanSelectAll'] = this.MasterTable.Selection.canSelectAll();
                        this.MasterTable.Renderer.Modifier.redrawHeader(this._ourColumn);
                    };
                    CheckboxifyPlugin.prototype.init = function (masterTable) {
                        var _this = this;
                        _super.prototype.init.call(this, masterTable);
                        this._ourColumn = this.MasterTable.InstanceManager.Columns['_checkboxify'];
                        var selectAll = function (e) { return _this.MasterTable.Selection.toggleAll(); };
                        var header = {
                            Column: this._ourColumn,
                            renderContent: null,
                            renderElement: null,
                            TemplateIdOverride: this.Configuration.SelectAllTemplateId,
                            selectAllEvent: function (e) { return _this.MasterTable.Selection.toggleAll(); }
                        };
                        this._ourColumn.Header = header;
                    };
                    CheckboxifyPlugin.prototype.subscribe = function (e) {
                        var _this = this;
                        e.SelectionChanged.subscribeAfter(function (e) { return _this.redrawHeader(); }, 'checkboxify');
                        e.ClientDataProcessing.subscribeAfter(function (e) { return _this.redrawHeader(); }, 'checkboxify');
                        e.DataReceived.subscribeAfter(function (e) { return _this.redrawHeader(); }, 'checkboxify');
                    };
                    return CheckboxifyPlugin;
                }(Reinforced.Lattice.Plugins.PluginBase));
                Checkboxify.CheckboxifyPlugin = CheckboxifyPlugin;
                Lattice.ComponentsContainer.registerComponent('Checkboxify', CheckboxifyPlugin);
            })(Checkboxify = Plugins.Checkboxify || (Plugins.Checkboxify = {}));
        })(Plugins = Lattice.Plugins || (Lattice.Plugins = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Plugins;
        (function (Plugins) {
            var Formwatch;
            (function (Formwatch) {
                var FormwatchPlugin = (function (_super) {
                    __extends(FormwatchPlugin, _super);
                    function FormwatchPlugin() {
                        var _this = _super !== null && _super.apply(this, arguments) || this;
                        _this._existingValues = {};
                        _this._filteringExecuted = {};
                        _this._timeouts = {};
                        _this._configurations = {};
                        return _this;
                    }
                    FormwatchPlugin.extractValueFromMultiSelect = function (o) {
                        var value = [];
                        for (var k = 0; k < o.options.length; k++) {
                            if (o.options[k].selected)
                                value.push(o.options[k].value);
                        }
                        return value;
                    };
                    FormwatchPlugin.extractInputValue = function (element, fieldConf, dateService) {
                        var value = null;
                        if (element.type === 'select-multiple') {
                            value = FormwatchPlugin.extractValueFromMultiSelect((element));
                        }
                        else if (element.type === 'checkbox') {
                            value = element.checked;
                        }
                        else if (element.type === 'radio') {
                            if (element.checked)
                                value = element.value;
                        }
                        else {
                            if (fieldConf.IsDateTime) {
                                value = dateService.getDateFromDatePicker(element);
                                if (!dateService.isValidDate(value)) {
                                    value = dateService.parse(element.value);
                                    if (!dateService.isValidDate(value)) {
                                        value = null;
                                    }
                                }
                                if (value != null)
                                    value = dateService.serialize(value);
                            }
                            else {
                                value = element.value;
                            }
                        }
                        if (value != null && value != undefined) {
                            if ((typeof value === 'string') && fieldConf.IsBoolean) {
                                if (fieldConf.IsNullable) {
                                    value = value.length === 0
                                        ? null
                                        : (value.toUpperCase() === 'TRUE' || value === '1' || value === 'YES');
                                }
                                else {
                                    value = (value.toUpperCase() === 'TRUE' || value === '1' || value === 'YES');
                                }
                            }
                            if ((typeof value === 'string') && (fieldConf.IsFloating || fieldConf.IsInteger)) {
                                value = value.length === 0
                                    ? (fieldConf.IsNullable ? null : 0)
                                    : (fieldConf.IsFloating ? parseFloat(value) : parseInt(value));
                            }
                        }
                        return value;
                    };
                    FormwatchPlugin.extractData = function (elements, fieldConf, dateService) {
                        var value = null;
                        var element = (elements.length > 0 ? elements.item(0) : null);
                        if (element) {
                            if (fieldConf.IsArray) {
                                if (fieldConf.ArrayDelimiter) {
                                    if (element.value == null || element.value.length === 0)
                                        value = [];
                                    else
                                        value = element.value.split(fieldConf.ArrayDelimiter);
                                }
                                else {
                                    if (elements.length === 1 && element.type === 'select-multiple') {
                                        value = FormwatchPlugin.extractValueFromMultiSelect(element);
                                    }
                                    else {
                                        value = [];
                                        for (var i = 0; i < elements.length; i++) {
                                            var el = elements.item(i);
                                            var exv = FormwatchPlugin.extractInputValue(el, fieldConf, dateService);
                                            if (el.type === 'checkbox') {
                                                if (exv === true) {
                                                    exv = el.value;
                                                }
                                                else {
                                                    continue;
                                                }
                                            }
                                            value.push(exv);
                                        }
                                    }
                                }
                            }
                            else {
                                for (var j = 0; j < elements.length; j++) {
                                    var v = FormwatchPlugin.extractInputValue(elements.item(j), fieldConf, dateService);
                                    if (v != null && v != undefined) {
                                        value = v;
                                        break;
                                    }
                                }
                            }
                        }
                        return value;
                    };
                    FormwatchPlugin.extractFormData = function (configuration, rootElement, dateService) {
                        var result = {};
                        for (var i = 0; i < configuration.length; i++) {
                            var fieldConf = configuration[i];
                            var value = null;
                            var name = fieldConf.FieldJsonName;
                            if (fieldConf.ConstantValue) {
                                value = fieldConf.ConstantValue;
                            }
                            else {
                                if (fieldConf.FieldValueFunction) {
                                    value = fieldConf.FieldValueFunction();
                                    if (fieldConf.IsDateTime) {
                                        if (typeof value === 'object') {
                                            value = dateService.serialize(value);
                                        }
                                    }
                                }
                                else {
                                    var elements = rootElement.querySelectorAll(fieldConf.FieldSelector);
                                    value = FormwatchPlugin.extractData(elements, fieldConf, dateService);
                                }
                                if (fieldConf.SetConstantIfNotSupplied && (value == null)) {
                                    value = fieldConf.ConstantValue;
                                }
                            }
                            if (value != null || result[name] == null || result[name] == undefined) {
                                result[name] = value;
                            }
                        }
                        return result;
                    };
                    FormwatchPlugin.prototype.modifyQuery = function (query, scope) {
                        var formData = FormwatchPlugin.extractFormData(this.Configuration.FieldsConfiguration, document, this.MasterTable.Date);
                        for (var fm in this.Configuration.FiltersMappings) {
                            if (this.Configuration.FiltersMappings.hasOwnProperty(fm)) {
                                var mappingConf = this.Configuration.FiltersMappings[fm];
                                var needToApply = (mappingConf.ForClient && mappingConf.ForServer)
                                    || (mappingConf.ForClient && scope === Lattice.QueryScope.Client)
                                    || (mappingConf.ForServer && scope === Lattice.QueryScope.Server)
                                    || (scope === Lattice.QueryScope.Transboundary);
                                if (needToApply) {
                                    switch (mappingConf.FilterType) {
                                        case 0:
                                            var val = formData[mappingConf.FieldKeys[0]];
                                            if (!val || val.length === 0)
                                                break;
                                            query.Filterings[fm] = val == null ? '' : val.toString();
                                            break;
                                        case 1:
                                            var v1 = '', v2 = '';
                                            if (mappingConf.FieldKeys.length === 1 && (Object.prototype.toString.call(formData[mappingConf[0]]) === '[object Array]')) {
                                                v1 = formData[mappingConf.FieldKeys[0]][0] == null ? '' : formData[mappingConf.FieldKeys[0]][0].toString();
                                                v2 = formData[mappingConf.FieldKeys[0]][1] == null ? '' : formData[mappingConf.FieldKeys[0]][1].toString();
                                            }
                                            else {
                                                v1 = formData[mappingConf.FieldKeys[0]] == null ? '' : formData[mappingConf.FieldKeys[0]].toString();
                                                v2 = formData[mappingConf.FieldKeys[1]] == null ? '' : formData[mappingConf.FieldKeys[1]].toString();
                                            }
                                            query.Filterings[fm] = v1 + "|" + v2;
                                            break;
                                        case 2:
                                            var serialized = [];
                                            if (mappingConf.FieldKeys.length === 1 && (Object.prototype.toString.call(formData[mappingConf[0]]) === '[object Array]')) {
                                                for (var i = 0; i < mappingConf[0].length; i++) {
                                                    if (mappingConf[0][i] == null)
                                                        serialized.push('');
                                                    else
                                                        serialized.push(mappingConf[0][i].toString());
                                                }
                                            }
                                            else {
                                                for (var m = 0; m < mappingConf.FieldKeys.length; m++) {
                                                    if (formData[mappingConf.FieldKeys[m]] == null)
                                                        serialized.push('');
                                                    else
                                                        serialized.push(formData[mappingConf.FieldKeys[m]].toString());
                                                }
                                            }
                                            query.Filterings[fm] = serialized.join('|');
                                            break;
                                    }
                                }
                            }
                        }
                        if (this.Configuration.DoNotEmbed)
                            return;
                        for (var j = 0; j < this.Configuration.FieldsConfiguration.length; j++) {
                            if (this.Configuration.FieldsConfiguration[j].DoNotEmbed)
                                delete formData[this.Configuration.FieldsConfiguration[j].FieldJsonName];
                        }
                        var str = JSON.stringify(formData);
                        query.AdditionalData['Formwatch'] = str;
                    };
                    FormwatchPlugin.prototype.subscribe = function (e) {
                        var _this = this;
                        for (var i = 0; i < this.Configuration.FieldsConfiguration.length; i++) {
                            var conf = this.Configuration.FieldsConfiguration[i];
                            var element = document.querySelector(conf.FieldSelector);
                            if (conf.AutomaticallyAttachDatepicker) {
                                this.MasterTable.Date.createDatePicker(element);
                            }
                            if (conf.TriggerSearchOnEvents && conf.TriggerSearchOnEvents.length > 0) {
                                for (var j = 0; j < conf.TriggerSearchOnEvents.length; j++) {
                                    var evtToTrigger = conf.TriggerSearchOnEvents[j];
                                    element.addEventListener(evtToTrigger, (function (c, el) { return function (evt) {
                                        _this.fieldChange(c.FieldSelector, c.SearchTriggerDelay, el, evt);
                                    }; })(conf, element));
                                }
                                this._existingValues[conf.FieldSelector] = element.value;
                            }
                        }
                    };
                    FormwatchPlugin.prototype.fieldChange = function (fieldSelector, delay, element, e) {
                        var _this = this;
                        if (this._filteringExecuted[fieldSelector])
                            return;
                        if (element.value === this._existingValues[fieldSelector]) {
                            return;
                        }
                        this._existingValues[fieldSelector] = element.value;
                        if (delay > 0) {
                            if (this._timeouts[fieldSelector])
                                clearTimeout(this._timeouts[fieldSelector]);
                            this._timeouts[fieldSelector] = setTimeout(function () {
                                _this._filteringExecuted[fieldSelector] = true;
                                _this.MasterTable.Controller.reload();
                                _this._filteringExecuted[fieldSelector] = false;
                            }, delay);
                        }
                        else {
                            this._filteringExecuted[fieldSelector] = true;
                            this.MasterTable.Controller.reload();
                            this._filteringExecuted[fieldSelector] = false;
                        }
                    };
                    FormwatchPlugin.prototype.init = function (masterTable) {
                        _super.prototype.init.call(this, masterTable);
                        for (var i = 0; i < this.Configuration.FieldsConfiguration.length; i++) {
                            this._configurations[this.Configuration.FieldsConfiguration[i].FieldJsonName] =
                                this.Configuration.FieldsConfiguration[i];
                        }
                        this.MasterTable.Loader.registerQueryPartProvider(this);
                    };
                    return FormwatchPlugin;
                }(Reinforced.Lattice.Plugins.PluginBase));
                Formwatch.FormwatchPlugin = FormwatchPlugin;
                Lattice.ComponentsContainer.registerComponent('Formwatch', FormwatchPlugin);
            })(Formwatch = Plugins.Formwatch || (Plugins.Formwatch = {}));
        })(Plugins = Lattice.Plugins || (Lattice.Plugins = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Plugins;
        (function (Plugins) {
            var Hideout;
            (function (Hideout) {
                var HideoutPlugin = (function (_super) {
                    __extends(HideoutPlugin, _super);
                    function HideoutPlugin() {
                        var _this = _super !== null && _super.apply(this, arguments) || this;
                        _this.ColumnStates = [];
                        _this._columnStates = {};
                        _this._isInitializing = true;
                        return _this;
                    }
                    HideoutPlugin.prototype.isColumnVisible = function (columnName) {
                        return this.isColumnInstanceVisible(this.MasterTable.InstanceManager.Columns[columnName]);
                    };
                    HideoutPlugin.prototype.isColumnInstanceVisible = function (col) {
                        if (!col)
                            return true;
                        return this._columnStates[col.RawName].Visible;
                    };
                    HideoutPlugin.prototype.hideColumnByName = function (rawColname) {
                        this.hideColumnInstance(this.MasterTable.InstanceManager.Columns[rawColname]);
                    };
                    HideoutPlugin.prototype.showColumnByName = function (rawColname) {
                        this.showColumnInstance(this.MasterTable.InstanceManager.Columns[rawColname]);
                    };
                    HideoutPlugin.prototype.toggleColumn = function (e) {
                        this.toggleColumnByName(e.EventArguments[0]);
                    };
                    HideoutPlugin.prototype.showColumn = function (e) {
                        this.showColumnByName(e.EventArguments[0]);
                    };
                    HideoutPlugin.prototype.hideColumn = function (e) {
                        this.hideColumnByName(e.EventArguments[0]);
                    };
                    HideoutPlugin.prototype.toggleColumnByName = function (columnName) {
                        if (this.isColumnVisible(columnName)) {
                            this.hideColumnByName(columnName);
                            return false;
                        }
                        else {
                            this.showColumnByName(columnName);
                            return true;
                        }
                    };
                    HideoutPlugin.prototype.modifyQuery = function (query, scope) {
                        var hidden = [];
                        var shown = [];
                        for (var i = 0; i < this.ColumnStates.length; i++) {
                            if (scope !== Lattice.QueryScope.Transboundary) {
                                if (this.Configuration.ColumnInitiatingReload.indexOf(this.ColumnStates[i].Column.RawName) < 0)
                                    continue;
                            }
                            if (!this.ColumnStates[i].Visible) {
                                hidden.push(this.ColumnStates[i].Column.RawName);
                            }
                            else {
                                shown.push(this.ColumnStates[i].Column.RawName);
                            }
                        }
                        query.AdditionalData['HideoutHidden'] = hidden.join(',');
                        query.AdditionalData['HideoutShown'] = shown.join(',');
                    };
                    HideoutPlugin.prototype.hideColumnInstance = function (c) {
                        if (!c)
                            return;
                        this._columnStates[c.RawName].Visible = false;
                        this._columnStates[c.RawName].DoesNotExists = false;
                        this.MasterTable.Renderer.Modifier.hideHeader(c);
                        this.MasterTable.Renderer.Modifier.hidePluginsByPosition("filter-" + c.RawName);
                        if (this._isInitializing)
                            return;
                        this.MasterTable.Renderer.Modifier.hideCellsByColumn(c);
                        if (this.Configuration.ColumnInitiatingReload.indexOf(c.RawName) > -1)
                            this.MasterTable.Controller.reload();
                        this.MasterTable.Renderer.Modifier.redrawPlugin(this);
                    };
                    HideoutPlugin.prototype.showColumnInstance = function (c) {
                        if (!c)
                            return;
                        this._columnStates[c.RawName].Visible = true;
                        var wasNotExist = this._columnStates[c.RawName].DoesNotExists;
                        this._columnStates[c.RawName].DoesNotExists = false;
                        this.MasterTable.Renderer.Modifier.showHeader(c);
                        this.MasterTable.Renderer.Modifier.showPluginsByPosition("filter-" + c.RawName);
                        if (this._isInitializing)
                            return;
                        if (wasNotExist) {
                            if (this.Configuration.ColumnInitiatingReload.indexOf(c.RawName) > -1) {
                                this.MasterTable.Controller.redrawVisibleData();
                                this.MasterTable.Controller.reload();
                            }
                            else {
                                this.MasterTable.Controller.redrawVisibleData();
                            }
                        }
                        else {
                            this.MasterTable.Renderer.Modifier.showCellsByColumn(c);
                            if (this.Configuration.ColumnInitiatingReload.indexOf(c.RawName) > -1) {
                                this.MasterTable.Controller.reload();
                            }
                        }
                        this.MasterTable.Renderer.Modifier.redrawPlugin(this);
                    };
                    HideoutPlugin.prototype.onBeforeDataRendered = function () {
                        for (var i = 0; i < this.ColumnStates.length; i++) {
                            var col = this.MasterTable.InstanceManager.Columns[this.ColumnStates[i].Column.RawName];
                            if (!this.ColumnStates[i].Visible) {
                                col.Configuration.IsDataOnly = true;
                            }
                            else {
                                col.Configuration.IsDataOnly = false;
                            }
                        }
                    };
                    HideoutPlugin.prototype.onDataRendered = function () {
                        for (var i = 0; i < this.ColumnStates.length; i++) {
                            if (!this.ColumnStates[i].Visible)
                                this.ColumnStates[i].DoesNotExists = true;
                        }
                        this.MasterTable.Renderer.Modifier.redrawPlugin(this);
                    };
                    HideoutPlugin.prototype.onLayourRendered = function () {
                        for (var j = 0; j < this.ColumnStates.length; j++) {
                            if (this.Configuration.HiddenColumns[this.ColumnStates[j].Column.RawName]) {
                                this.hideColumnByName(this.ColumnStates[j].Column.RawName);
                            }
                        }
                        this._isInitializing = false;
                    };
                    HideoutPlugin.prototype.init = function (masterTable) {
                        _super.prototype.init.call(this, masterTable);
                        this.MasterTable.Loader.registerQueryPartProvider(this);
                        for (var i = 0; i < this.Configuration.HideableColumnsNames.length; i++) {
                            var hideable = this.Configuration.HideableColumnsNames[i];
                            var col = this.MasterTable.InstanceManager.Columns[hideable];
                            var instanceInfo = {
                                DoesNotExists: this.Configuration.HiddenColumns.hasOwnProperty(hideable),
                                Visible: true,
                                RawName: hideable,
                                Name: col.Configuration.Title,
                                Column: col
                            };
                            if (col.Configuration.IsDataOnly) {
                                throw new Error("Column " + col.RawName + " is .DataOnly but\nincluded into hideable columns list.\n.DataOnly columns are invalid for Hideout plugin. Please remove it from selectable columns list");
                            }
                            this._columnStates[hideable] = instanceInfo;
                            this.ColumnStates.push(instanceInfo);
                        }
                    };
                    HideoutPlugin.prototype.renderContent = function (p) {
                        this.defaultRender(p);
                    };
                    HideoutPlugin.prototype.subscribe = function (e) {
                        e.DataRendered.subscribeAfter(this.onDataRendered.bind(this), 'hideout');
                        e.DataRendered.subscribeBefore(this.onBeforeDataRendered.bind(this), 'hideout');
                        e.LayoutRendered.subscribeAfter(this.onLayourRendered.bind(this), 'hideout');
                    };
                    HideoutPlugin.prototype.isColVisible = function (columnName) {
                        var visible = false;
                        if (this._isInitializing) {
                            visible = !this.Configuration.HiddenColumns.hasOwnProperty(columnName);
                        }
                        else {
                            for (var i = 0; i < this.ColumnStates.length; i++) {
                                if (this.ColumnStates[i].Column.RawName === columnName) {
                                    visible = this.ColumnStates[i].Visible;
                                    break;
                                }
                            }
                        }
                        return visible;
                    };
                    return HideoutPlugin;
                }(Reinforced.Lattice.Plugins.PluginBase));
                Hideout.HideoutPlugin = HideoutPlugin;
                Lattice.ComponentsContainer.registerComponent('Hideout', HideoutPlugin);
            })(Hideout = Plugins.Hideout || (Plugins.Hideout = {}));
        })(Plugins = Lattice.Plugins || (Lattice.Plugins = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Plugins;
        (function (Plugins) {
            var Hierarchy;
            (function (Hierarchy) {
                var HierarchyPlugin = (function (_super) {
                    __extends(HierarchyPlugin, _super);
                    function HierarchyPlugin() {
                        var _this = _super !== null && _super.apply(this, arguments) || this;
                        _this._globalHierarchy = {};
                        _this._currentHierarchy = {};
                        _this._notInHierarchy = {};
                        return _this;
                    }
                    HierarchyPlugin.prototype.init = function (masterTable) {
                        _super.prototype.init.call(this, masterTable);
                        this._parentKeyFunction = this.MasterTable.DataHolder
                            .compileKeyFunction(this.Configuration.ParentKeyFields);
                        this.MasterTable.DataHolder.registerClientFilter(this);
                    };
                    HierarchyPlugin.prototype.expandRow = function (args) {
                        this.toggleSubtreeByObject(this.MasterTable.DataHolder.StoredCache[args.Row], true);
                    };
                    HierarchyPlugin.prototype.expandLoadRow = function (args) {
                        this.loadRow(this.MasterTable.DataHolder.StoredCache[args.Row]);
                    };
                    HierarchyPlugin.prototype.toggleLoadRow = function (args) {
                        this.toggleSubtreeOrLoad(this.MasterTable.DataHolder.StoredCache[args.Row], null);
                    };
                    HierarchyPlugin.prototype.collapseRow = function (args) {
                        this.toggleSubtreeByObject(this.MasterTable.DataHolder.StoredCache[args.Row], false);
                    };
                    HierarchyPlugin.prototype.toggleRow = function (args) {
                        this.toggleSubtreeByObject(this.MasterTable.DataHolder.StoredCache[args.Row], null);
                    };
                    HierarchyPlugin.prototype.toggleSubtreeOrLoad = function (dataObject, turnOpen) {
                        if (dataObject == null || dataObject == undefined)
                            return;
                        if (turnOpen == null || turnOpen == undefined)
                            turnOpen = !dataObject.__isExpanded;
                        if (dataObject.__isExpanded === turnOpen)
                            return;
                        if (turnOpen) {
                            if (dataObject.__isLoaded)
                                this.expand(dataObject);
                            else
                                this.loadRow(dataObject);
                        }
                        else
                            this.collapse(dataObject, true);
                    };
                    HierarchyPlugin.prototype.toggleSubtreeByObject = function (dataObject, turnOpen) {
                        if (dataObject == null || dataObject == undefined)
                            return;
                        if (turnOpen == null || turnOpen == undefined)
                            turnOpen = !dataObject.__isExpanded;
                        if (dataObject.__isExpanded === turnOpen)
                            return;
                        if (turnOpen)
                            this.expand(dataObject);
                        else
                            this.collapse(dataObject, true);
                    };
                    HierarchyPlugin.prototype.loadRow = function (dataObject) {
                        var _this = this;
                        dataObject.IsLoading = true;
                        dataObject.IsExpanded = true;
                        dataObject.__isExpanded = true;
                        this.MasterTable.Controller.redrawVisibleDataObject(dataObject);
                        this.MasterTable.Commands.triggerCommand('_Children', dataObject, function () {
                            dataObject.IsLoading = false;
                            dataObject.__isLoaded = true;
                            _this.MasterTable.Controller.redrawVisibleDataObject(dataObject);
                        });
                        return;
                    };
                    HierarchyPlugin.prototype.isParentExpanded = function (dataObject) {
                        if (dataObject.__parent == null)
                            return true;
                        var parent = this.MasterTable.DataHolder.getByPrimaryKey(dataObject.__parent);
                        return parent.__isExpanded;
                    };
                    HierarchyPlugin.prototype.expand = function (dataObject) {
                        dataObject.IsExpanded = true;
                        dataObject.__isExpanded = true;
                        if (!this.isParentExpanded(dataObject))
                            return;
                        var toggled = this.toggleVisibleChildren(dataObject, true);
                        var st = this.MasterTable.DataHolder.StoredCache;
                        this.MasterTable.Controller.redrawVisibleDataObject(dataObject);
                        var src = [];
                        for (var i = 0; i < toggled.length; i++) {
                            src.push(st[toggled[i]]);
                        }
                        src = this.MasterTable.DataHolder.orderWithCurrentOrderings(src);
                        src = this.orderHierarchy(src, dataObject.Deepness + 1);
                        var ordered = this.MasterTable.DataHolder.Ordered;
                        var displayed = this.MasterTable.DataHolder.DisplayedData;
                        var orderedIdx = ordered.indexOf(dataObject);
                        this.MasterTable.DataHolder.Ordered.splice.apply(this.MasterTable.DataHolder.Ordered, [orderedIdx + 1, 0].concat(src));
                        var pos = displayed.indexOf(dataObject);
                        var newNodes = src;
                        var existingDisplayed = this.MasterTable.DataHolder.DisplayedData.length;
                        var head = displayed.slice(0, pos + 1), tail = displayed.slice(pos + 1);
                        var rows = null;
                        if (this.MasterTable.Partition.Take > 0) {
                            if (pos === existingDisplayed - 1) {
                                this.firePartitionChange();
                                return;
                            }
                            var totallength = head.length + newNodes.length + tail.length;
                            if (totallength > this.MasterTable.Partition.Take) {
                                var needToCut = totallength - this.MasterTable.Partition.Take;
                                if (needToCut < tail.length) {
                                    this.removeNLastRows(needToCut);
                                    tail = tail.slice(0, tail.length - needToCut);
                                    this.appendNodes(newNodes, tail);
                                }
                                else {
                                    this.removeNLastRows(tail.length);
                                    needToCut -= tail.length;
                                    tail = [];
                                    if (needToCut > 0) {
                                        newNodes = newNodes.slice(0, newNodes.length - needToCut);
                                    }
                                    rows = this.MasterTable.Controller.produceRowsFromData(newNodes);
                                    for (var j = 0; j < rows.length; j++) {
                                        this.MasterTable.Renderer.Modifier.appendRow(rows[j]);
                                    }
                                }
                            }
                            else {
                                this.appendNodes(newNodes, tail);
                            }
                        }
                        else {
                            this.appendNodes(newNodes, tail);
                        }
                        this.MasterTable.DataHolder.DisplayedData = head.concat(newNodes, tail);
                        this.firePartitionChange();
                    };
                    HierarchyPlugin.prototype.appendNodes = function (newNodes, tail) {
                        var beforeIdx = tail.length === 0 ? null : tail[0]['__i'];
                        var rows = this.MasterTable.Controller.produceRowsFromData(newNodes);
                        for (var j = 0; j < rows.length; j++) {
                            this.MasterTable.Renderer.Modifier.appendRow(rows[j], beforeIdx);
                        }
                    };
                    HierarchyPlugin.prototype.firePartitionChange = function (tk, sk, fsk) {
                        tk = tk == null ? this.MasterTable.Partition.Take : tk;
                        sk = sk == null ? this.MasterTable.Partition.Skip : sk;
                        fsk = fsk == null ? this.MasterTable.Partition.FloatingSkip : fsk;
                        var prevTk = this.MasterTable.Partition.Take;
                        var prevSk = this.MasterTable.Partition.Skip;
                        var prefFsk = this.MasterTable.Partition.FloatingSkip;
                        this.MasterTable.Partition.Take = tk;
                        this.MasterTable.Partition.Skip = sk;
                        this.MasterTable.Partition.Skip = fsk;
                        this.MasterTable.Events.PartitionChanged.invokeAfter(this, {
                            Take: tk, PreviousTake: prevTk, Skip: sk, PreviousSkip: prevSk,
                            PreviousFloatingSkip: prefFsk, FloatingSkip: fsk
                        });
                    };
                    HierarchyPlugin.prototype.removeNLastRows = function (n) {
                        var last = this.MasterTable.DataHolder
                            .DisplayedData[this.MasterTable.DataHolder.DisplayedData.length - 1];
                        var lastRow = this.MasterTable.Renderer.Locator.getRowElementByObject(last);
                        for (var i = 0; i < n; i++) {
                            var lr = lastRow.previousElementSibling;
                            this.MasterTable.Renderer.Modifier.destroyElement(lastRow);
                            lastRow = lr;
                        }
                    };
                    HierarchyPlugin.prototype.toggleVisibleChildren = function (dataObject, visible, hierarchy) {
                        if (!hierarchy)
                            hierarchy = this._currentHierarchy;
                        var subtree = hierarchy[dataObject.__i];
                        if (!subtree)
                            return [];
                        var result = [];
                        for (var i = 0; i < subtree.length; i++) {
                            var child = this.MasterTable.DataHolder.StoredCache[subtree[i]];
                            var nodeToggled = this.toggleVisible(child, visible);
                            result = result.concat(nodeToggled);
                        }
                        return result;
                    };
                    HierarchyPlugin.prototype.toggleVisible = function (dataObject, visible, hierarchy) {
                        if (!hierarchy)
                            hierarchy = this._currentHierarchy;
                        var result = [dataObject.__i];
                        dataObject.__visible = visible;
                        if (!dataObject.__isExpanded)
                            return result;
                        var subtree = hierarchy[dataObject.__i];
                        for (var j = 0; j < subtree.length; j++) {
                            var obj = this.MasterTable.DataHolder.StoredCache[subtree[j]];
                            obj.__visible = visible;
                            result = result.concat(this.toggleVisible(obj, visible));
                        }
                        return result;
                    };
                    HierarchyPlugin.prototype.collapse = function (dataObject, redraw) {
                        dataObject.IsExpanded = false;
                        dataObject.__isExpanded = false;
                        if (!this.isParentExpanded(dataObject))
                            return;
                        var displayed = this.MasterTable.DataHolder.DisplayedData;
                        var ordered = this.MasterTable.DataHolder.Ordered;
                        var hidden = this.toggleVisibleChildren(dataObject, false);
                        var hiddenCount = hidden.length;
                        this.MasterTable.Controller.redrawVisibleDataObject(dataObject);
                        var row = this.MasterTable.Renderer.Locator.getRowElementByIndex(dataObject.__i);
                        var orIdx = ordered.indexOf(dataObject);
                        var dIdx = displayed.indexOf(dataObject);
                        ordered.splice(orIdx + 1, hiddenCount);
                        var oldDisplayedLength = displayed.length;
                        var displayedHidden = displayed.splice(dIdx + 1, hiddenCount).length;
                        var head = [];
                        var stay = displayed.splice(dIdx + 1);
                        var tail = ordered.slice(orIdx + 1 + stay.length, orIdx + 1 + stay.length + displayedHidden);
                        var increaseTail = 0;
                        var nskip = null;
                        var totalLength = displayed.length + stay.length + tail.length;
                        if (totalLength < oldDisplayedLength && this.MasterTable.Partition.Skip > 0) {
                            nskip = this.MasterTable.Partition.Skip;
                            nskip -= (oldDisplayedLength - totalLength);
                            if (nskip < 0) {
                                increaseTail = -nskip;
                                nskip = 0;
                            }
                            head = ordered.slice(nskip, this.MasterTable.Partition.Skip);
                        }
                        if (increaseTail > 0) {
                            tail = ordered.slice(orIdx + 1 + stay.length, orIdx + 1 + displayedHidden + increaseTail + stay.length);
                        }
                        displayed = head.concat(displayed, stay, tail);
                        this.MasterTable.DataHolder.DisplayedData = displayed;
                        console.log(displayed.length);
                        if (redraw) {
                            var ne = row.nextElementSibling;
                            for (var i = 0; i < displayedHidden; i++) {
                                var n = ne.nextElementSibling;
                                this.MasterTable.Renderer.Modifier.destroyElement(ne);
                                ne = n;
                            }
                            var rows = null;
                            if (head.length > 0) {
                                rows = this.MasterTable.Controller.produceRowsFromData(head);
                                for (var k = rows.length - 1; k >= 0; k--) {
                                    this.MasterTable.Renderer.Modifier.prependRow(rows[k]);
                                }
                            }
                            if (tail.length > 0) {
                                rows = this.MasterTable.Controller.produceRowsFromData(tail);
                                for (var l = 0; l < rows.length; l++) {
                                    this.MasterTable.Renderer.Modifier.appendRow(rows[l]);
                                }
                            }
                            this.firePartitionChange(null, nskip, nskip);
                        }
                    };
                    HierarchyPlugin.prototype.onFiltered_after = function () {
                        var src = this.MasterTable.DataHolder.Filtered;
                        var needSeparateHierarchy = true;
                        if (src.length === this.MasterTable.DataHolder.StoredData.length) {
                            this._currentHierarchy = this._globalHierarchy;
                            needSeparateHierarchy = false;
                            this.restoreHierarchyData(src);
                        }
                        var expandParents = this.Configuration.CollapsedNodeFilterBehavior ===
                            Hierarchy.TreeCollapsedNodeFilterBehavior.IncludeCollapsed;
                        if (expandParents) {
                            this.expandParents(src);
                        }
                        var cpy = [];
                        for (var i = 0; i < src.length; i++) {
                            if (src[i].__visible)
                                cpy.push(src[i]);
                        }
                        src = cpy;
                        if (needSeparateHierarchy)
                            this.buildCurrentHierarchy(src);
                        this.MasterTable.DataHolder.Filtered = src;
                    };
                    HierarchyPlugin.prototype.expandParents = function (src) {
                        var addParents = {};
                        for (var j = 0; j < src.length; j++) {
                            this.addParents(src[j], addParents);
                        }
                        for (var l = 0; l < src.length; l++) {
                            if (addParents[src[l]['__i']]) {
                                delete addParents[src[l]['__i']];
                            }
                        }
                        for (var k in addParents) {
                            var obj = this.MasterTable.DataHolder.StoredCache[k];
                            obj.IsExpanded = true;
                            obj.__isExpanded = true;
                            this.toggleVisibleChildren(obj, true);
                            src.push(obj);
                        }
                    };
                    HierarchyPlugin.prototype.restoreHierarchyData = function (d) {
                        for (var k = 0; k < d.length; k++) {
                            var o = d[k];
                            o.__serverChildrenCount = o.ChildrenCount;
                            o.LocalChildrenCount = this._globalHierarchy[o['__i']].length;
                            o.__visible = this.visible(o);
                        }
                    };
                    HierarchyPlugin.prototype.buildCurrentHierarchy = function (d) {
                        this._currentHierarchy = {};
                        for (var i = 0; i < d.length; i++) {
                            var idx = d[i].__i;
                            this._currentHierarchy[idx] = [];
                            for (var j = 0; j < d.length; j++) {
                                if (d[j].__parent === d[i].__key) {
                                    this._currentHierarchy[idx].push(d[j].__i);
                                }
                            }
                        }
                        for (var k = 0; k < d.length; k++) {
                            var o = d[k];
                            o.LocalChildrenCount = this._currentHierarchy[o['__i']].length;
                        }
                    };
                    HierarchyPlugin.prototype.addParents = function (o, existing) {
                        if (o.__parent == null)
                            return;
                        while (o.__parent != null) {
                            o = this.MasterTable.DataHolder.getByPrimaryKey(o.__parent);
                            existing[o.__i] = true;
                        }
                    };
                    HierarchyPlugin.prototype.onOrdered_after = function () {
                        var src = this.MasterTable.DataHolder.Ordered;
                        this.MasterTable.DataHolder.Ordered = this.orderHierarchy(src, 0);
                    };
                    HierarchyPlugin.prototype.orderHierarchy = function (src, minDeepness) {
                        var filteredHierarchy = this.buildHierarchy(src, minDeepness);
                        var target = [];
                        for (var i = 0; i < filteredHierarchy.roots.length; i++) {
                            this.appendChildren(target, filteredHierarchy.roots[i], filteredHierarchy.Hierarchy);
                        }
                        return target;
                    };
                    HierarchyPlugin.prototype.appendChildren = function (target, index, hierarchy) {
                        var thisNode = this.MasterTable.DataHolder.StoredCache[index];
                        target.push(thisNode);
                        for (var i = 0; i < hierarchy[index].length; i++) {
                            this.appendChildren(target, hierarchy[index][i], hierarchy);
                        }
                    };
                    HierarchyPlugin.prototype.buildHierarchy = function (d, minDeepness) {
                        var result = {};
                        var roots = [];
                        for (var i = 0; i < d.length; i++) {
                            var idx = d[i].__i;
                            result[idx] = [];
                            if (d[i].Deepness === minDeepness)
                                roots.push(d[i].__i);
                            for (var j = 0; j < d.length; j++) {
                                if (d[j].__parent === d[i].__key) {
                                    result[idx].push(d[j].__i);
                                }
                            }
                        }
                        return {
                            roots: roots,
                            Hierarchy: result
                        };
                    };
                    HierarchyPlugin.prototype.isParentNull = function (dataObject) {
                        for (var i = 0; i < this.Configuration.ParentKeyFields.length; i++) {
                            if (dataObject[this.Configuration.ParentKeyFields[i]] != null)
                                return false;
                        }
                        return true;
                    };
                    HierarchyPlugin.prototype.deepness = function (obj) {
                        var result = 0;
                        while (obj.__parent != null) {
                            result++;
                            obj = this.MasterTable.DataHolder.getByPrimaryKey(obj.__parent);
                            if (!obj)
                                throw new Error("Fields " + this.Configuration.ParentKeyFields
                                    .concat(', ') + " must be all null in root nodes");
                        }
                        return result;
                    };
                    HierarchyPlugin.prototype.visible = function (obj) {
                        var vis = this.MasterTable.DataHolder.satisfyCurrentFilters(obj);
                        if (!vis)
                            return false;
                        while (obj.__parent != null) {
                            obj = this.MasterTable.DataHolder.getByPrimaryKey(obj.__parent);
                            if (!obj.__isExpanded)
                                return false;
                        }
                        return true;
                    };
                    HierarchyPlugin.prototype.onDataReceived_after = function (e) {
                        if (e.EventArgs.IsAdjustment)
                            return;
                        var d = this.MasterTable.DataHolder.StoredData;
                        this._globalHierarchy = {};
                        for (var i = 0; i < d.length; i++) {
                            var idx = d[i].__i;
                            this._globalHierarchy[idx] = [];
                            d[i].__isExpanded = d[i].IsExpanded;
                            for (var j = 0; j < d.length; j++) {
                                if (!d[j].__parent) {
                                    if (this.isParentNull(d[j]))
                                        d[j].__parent = null;
                                    else
                                        d[j].__parent = this._parentKeyFunction(d[j]);
                                }
                                if (d[j].__parent === d[i].__key) {
                                    this._globalHierarchy[idx].push(d[j].__i);
                                }
                            }
                        }
                        for (var k = 0; k < this.MasterTable.DataHolder.StoredData.length; k++) {
                            var o = this.MasterTable.DataHolder.StoredData[k];
                            o.__serverChildrenCount = o.ChildrenCount;
                            o.LocalChildrenCount = this._globalHierarchy[o['__i']].length;
                            o.Deepness = this.deepness(o);
                            o.__visible = this.visible(o);
                        }
                    };
                    HierarchyPlugin.prototype.setServerChildrenCount = function (dataObject) {
                        dataObject.ChildrenCount = dataObject.__serverChildrenCount;
                    };
                    HierarchyPlugin.prototype.setLocalChildrenCount = function (dataObject) {
                        dataObject.ChildrenCount = dataObject.LocalChildrenCount;
                    };
                    HierarchyPlugin.prototype.setChildrenCount = function (dataObject, count) {
                        dataObject.ChildrenCount = count;
                    };
                    HierarchyPlugin.prototype.proceedAddedData = function (added) {
                        for (var i = 0; i < added.length; i++) {
                            if (this.isParentNull(added[i]))
                                added[i].__parent = null;
                            else
                                added[i].__parent = this._parentKeyFunction(added[i]);
                            this._globalHierarchy[added[i]['__i']] = [];
                        }
                        for (var j = 0; j < added.length; j++) {
                            if (added[j].__parent != null) {
                                var parent = this.MasterTable.DataHolder.getByPrimaryKey(added[j].__parent);
                                this._globalHierarchy[parent['__i']].push(added[j]['__i']);
                            }
                        }
                        for (var k = 0; k < added.length; k++) {
                            var o = added[k];
                            o.__serverChildrenCount = o.ChildrenCount;
                            o.LocalChildrenCount = this._globalHierarchy[o['__i']].length;
                            o.Deepness = this.deepness(o);
                            o.__visible = this.visible(o);
                        }
                    };
                    HierarchyPlugin.prototype.proceedUpdatedData = function (d) {
                        var obj = null;
                        for (var i = 0; i < d.length; i++) {
                            obj = d[i];
                            var newParent = null;
                            if (!this.isParentNull(d[i]))
                                newParent = this._parentKeyFunction(obj);
                            this.moveItem(obj, newParent);
                        }
                        for (var j = 0; j < d.length; j++) {
                            obj = d[j];
                            if (obj.__isExpanded !== obj.IsExpanded) {
                                if (obj.IsExpanded) {
                                    obj.__isExpanded = true;
                                    this.toggleVisibleChildren(obj, true, this._globalHierarchy);
                                }
                                else {
                                    obj.__isExpanded = false;
                                    this.toggleVisibleChildren(obj, false, this._globalHierarchy);
                                }
                            }
                        }
                    };
                    HierarchyPlugin.prototype.moveItems = function (items, newParent) {
                        var newParentKey = (!newParent) ? null : newParent.__key;
                        for (var i = 0; i < items.length; i++) {
                            this.moveItem(items[i], newParentKey);
                        }
                        this.MasterTable.DataHolder.filterStoredDataWithPreviousQuery();
                        this.MasterTable.Controller.redrawVisibleData();
                    };
                    HierarchyPlugin.prototype.moveItem = function (dataObject, newParentKey) {
                        var oldParent = dataObject.__parent;
                        if (oldParent != null) {
                            var oldParentObj = this.MasterTable.DataHolder.getByPrimaryKey(oldParent);
                            if (!oldParentObj) {
                                this.moveFromNotInHierarchy(dataObject.__key, newParentKey);
                                return;
                            }
                            var op = this._globalHierarchy[oldParentObj['__i']];
                            var idx = op.indexOf(dataObject['__i']);
                            if (idx > -1)
                                op.splice(idx, 1);
                        }
                        if (newParentKey == null) {
                            dataObject.__visible = this.MasterTable.DataHolder.satisfyCurrentFilters(dataObject);
                            return;
                        }
                        var newParentObj = this.MasterTable.DataHolder.getByPrimaryKey(newParentKey);
                        if (!newParentObj)
                            throw new Error("Cannot find parent " + newParentKey + " to move");
                        dataObject.__parent = newParentObj['__i'];
                        dataObject.__visible = newParentObj.__isExpanded && this.MasterTable.DataHolder.satisfyCurrentFilters(dataObject);
                    };
                    HierarchyPlugin.prototype.moveFromNotInHierarchy = function (key, newParentKey) {
                        if (!this._notInHierarchy[key])
                            return;
                        var targetObj = this.MasterTable.DataHolder.getByPrimaryKey(key);
                        if (!targetObj)
                            return;
                        var subtree = [];
                        this._globalHierarchy[targetObj['__i']] = subtree;
                        if (newParentKey == null) {
                            targetObj['__parent'] = null;
                        }
                        else {
                            var newParentObj = this.MasterTable.DataHolder.getByPrimaryKey(newParentKey);
                            if (!newParentObj)
                                throw new Error("Cannot find parent " + newParentKey + " to move from outside of tree");
                            targetObj['__parent'] = newParentKey;
                            var parentSubtree = this._globalHierarchy[newParentObj['__i']];
                            parentSubtree.push(targetObj['__i']);
                            targetObj.__visible = newParentObj.__isExpanded && this.MasterTable.DataHolder.satisfyCurrentFilters(targetObj);
                        }
                        var children = this._notInHierarchy[key];
                        for (var i = 0; i < children.length; i++) {
                            this.moveFromNotInHierarchy(children[i], targetObj.__key);
                        }
                        delete this._notInHierarchy[key];
                    };
                    HierarchyPlugin.prototype.cleanupNotInHierarchy = function () {
                        for (var nk in this._notInHierarchy) {
                            for (var i = 0; i < this._notInHierarchy[nk].length; i++) {
                                this.MasterTable.DataHolder.detachByKey(this._notInHierarchy[nk][i]);
                            }
                            this.MasterTable.DataHolder.detachByKey(nk);
                        }
                        this._notInHierarchy = {};
                    };
                    HierarchyPlugin.prototype.onAdjustment_after = function (e) {
                        var data = e.EventArgs;
                        this.proceedAddedData(data.AddedData);
                        this.proceedUpdatedData(data.TouchedData);
                        this.cleanupNotInHierarchy();
                        data.NeedRefilter = true;
                    };
                    HierarchyPlugin.prototype.onAdjustment_before = function (e) {
                        var data = e.EventArgs;
                        var rk = data.RemoveKeys;
                        this._notInHierarchy = {};
                        for (var i = 0; i < rk.length; i++) {
                            var toRemove = this.MasterTable.DataHolder.getByPrimaryKey(rk[i]);
                            this.removeFromHierarchySubtrees(toRemove, this._globalHierarchy);
                            this.removeFromHierarchySubtrees(toRemove, this._currentHierarchy);
                            this.moveToNotInHierarchy(toRemove['__i']);
                        }
                    };
                    HierarchyPlugin.prototype.moveToNotInHierarchy = function (parent) {
                        var subtree = this._globalHierarchy[parent];
                        var parentObj = this.MasterTable.DataHolder.StoredCache[parent];
                        if (!parentObj)
                            return;
                        var childKeys = [];
                        this._notInHierarchy[parent['__key']] = childKeys;
                        for (var i = 0; i < subtree.length; i++) {
                            var subObj = this.MasterTable.DataHolder.StoredCache[subtree[i]];
                            if (subObj) {
                                childKeys.push(subObj['__key']);
                            }
                        }
                        for (var j = 0; j < subtree.length; j++) {
                            this.moveToNotInHierarchy(subtree[j]);
                        }
                    };
                    HierarchyPlugin.prototype.removeFromHierarchySubtrees = function (toRemove, hierarchy) {
                        if (toRemove.__parent != null) {
                            var parent = this.MasterTable.DataHolder.getByPrimaryKey(toRemove.__parent);
                            if (hierarchy[parent['__i']]) {
                                var subtree = hierarchy[parent['__i']];
                                var idx = subtree.indexOf(toRemove['__i']);
                                if (idx > -1) {
                                    subtree.splice(idx, 1);
                                }
                            }
                        }
                    };
                    HierarchyPlugin.prototype.subscribe = function (e) {
                        e.DataReceived.subscribeAfter(this.onDataReceived_after.bind(this), 'hierarchy');
                        e.Filtered.subscribeAfter(this.onFiltered_after.bind(this), 'hierarchy');
                        e.Ordered.subscribeAfter(this.onOrdered_after.bind(this), 'hierarchy');
                        e.Adjustment.subscribeAfter(this.onAdjustment_after.bind(this), 'hierarchy');
                        e.Adjustment.subscribeBefore(this.onAdjustment_before.bind(this), 'hierarchy');
                    };
                    HierarchyPlugin.prototype.precompute = function (query, context) { };
                    HierarchyPlugin.prototype.filterPredicate = function (rowObject, context, query) {
                        return true;
                    };
                    return HierarchyPlugin;
                }(Reinforced.Lattice.Plugins.PluginBase));
                Hierarchy.HierarchyPlugin = HierarchyPlugin;
                Lattice.ComponentsContainer.registerComponent('Hierarchy', HierarchyPlugin);
            })(Hierarchy = Plugins.Hierarchy || (Plugins.Hierarchy = {}));
        })(Plugins = Lattice.Plugins || (Lattice.Plugins = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Plugins;
        (function (Plugins) {
            var Limit;
            (function (Limit) {
                var LimitPlugin = (function (_super) {
                    __extends(LimitPlugin, _super);
                    function LimitPlugin() {
                        var _this = _super !== null && _super.apply(this, arguments) || this;
                        _this._limitSize = 0;
                        _this.Sizes = [];
                        return _this;
                    }
                    LimitPlugin.prototype.renderContent = function (p) {
                        this.defaultRender(p);
                    };
                    LimitPlugin.prototype.changeLimitHandler = function (e) {
                        var limit = e.EventArguments[0];
                        if (typeof limit === "string")
                            limit = 0;
                        this.MasterTable.Partition.setTake(limit);
                    };
                    LimitPlugin.prototype.changeLimit = function (take) {
                        var limit = take;
                        var changed = this._limitSize !== limit;
                        if (!changed)
                            return;
                        this._limitSize = limit;
                        var labelPair = null;
                        for (var i = 0; i < this.Sizes.length; i++) {
                            if (this.Sizes[i].Value === limit) {
                                labelPair = this.Sizes[i];
                                break;
                            }
                        }
                        if (labelPair != null) {
                            this.SelectedValue = labelPair;
                        }
                        else {
                            this.SelectedValue = {
                                IsSeparator: false,
                                Label: take.toString(),
                                Value: take
                            };
                        }
                        this.MasterTable.Renderer.Modifier.redrawPlugin(this);
                    };
                    LimitPlugin.prototype.onPartitionChange = function (e) {
                        if (e.EventArgs.Take !== e.EventArgs.PreviousTake) {
                            this.changeLimit(e.EventArgs.Take);
                        }
                    };
                    LimitPlugin.prototype.init = function (masterTable) {
                        _super.prototype.init.call(this, masterTable);
                        var def = null;
                        var initTake = this.MasterTable.Configuration.Partition.InitialTake.toString();
                        for (var i = 0; i < this.Configuration.LimitValues.length; i++) {
                            var a = {
                                Value: this.Configuration.LimitValues[i],
                                Label: this.Configuration.LimitLabels[i],
                                IsSeparator: this.Configuration.LimitLabels[i] === '-'
                            };
                            this.Sizes.push(a);
                            if (a.Value === this.MasterTable.Configuration.Partition.InitialTake) {
                                def = a;
                            }
                        }
                        if (def == null) {
                            def = {
                                Value: this.MasterTable.Configuration.Partition.InitialTake,
                                Label: initTake,
                                IsSeparator: false,
                            };
                            this.Sizes.push(def);
                        }
                        this.SelectedValue = def;
                        this._limitSize = def.Value;
                    };
                    LimitPlugin.prototype.subscribe = function (e) {
                        e.PartitionChanged.subscribeAfter(this.onPartitionChange.bind(this), 'limit');
                    };
                    return LimitPlugin;
                }(Reinforced.Lattice.Plugins.PluginBase));
                Limit.LimitPlugin = LimitPlugin;
                Lattice.ComponentsContainer.registerComponent('Limit', LimitPlugin);
            })(Limit = Plugins.Limit || (Plugins.Limit = {}));
        })(Plugins = Lattice.Plugins || (Lattice.Plugins = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Plugins;
        (function (Plugins) {
            var LoadingOverlap;
            (function (LoadingOverlap) {
                var LoadingOverlapPlugin = (function (_super) {
                    __extends(LoadingOverlapPlugin, _super);
                    function LoadingOverlapPlugin() {
                        var _this = _super !== null && _super.apply(this, arguments) || this;
                        _this._isOverlapped = false;
                        _this.afterDrawn = function (e) {
                            _this.MasterTable.Events.Loading.subscribeBefore(function (e) { return _this.onBeforeLoading(e); }, 'overlapLoading');
                            _this.MasterTable.Events.DataRendered.subscribeAfter(function () { return _this.deoverlap(); }, 'overlapLoading');
                            _this.MasterTable.Events.Loading.subscribeAfter(function () { return _this.deoverlap(); }, 'overlapLoading');
                        };
                        return _this;
                    }
                    LoadingOverlapPlugin.prototype.overlapAll = function () {
                        if (this._isOverlapped)
                            return;
                        this._overlapInstances = [];
                        var ths = this;
                        for (var k in this.Configuration.Overlaps) {
                            if (this.Configuration.Overlaps.hasOwnProperty(k)) {
                                var elements = null;
                                if (k === '$All')
                                    elements = [this.MasterTable.Renderer.RootElement];
                                else if (k === '$BodyOnly')
                                    elements = [this.MasterTable.Renderer.BodyElement];
                                else if (k === '$Parent')
                                    elements = [this.MasterTable.Renderer.RootElement.parentElement];
                                else {
                                    elements = document.querySelectorAll(k);
                                }
                                var info = {
                                    Entries: []
                                };
                                for (var i = 0; i < elements.length; i++) {
                                    var layer = this.createOverlap(elements[i], this.Configuration.Overlaps[k]);
                                    var updateFn = (function (l, e) {
                                        return function () { ths.updateCoords(l, e); };
                                    })(layer, elements[i]);
                                    var sensor = new Reinforced.Lattice.Rendering.Resensor(elements[i], updateFn);
                                    sensor.attach();
                                    var entry = {
                                        Element: elements[i],
                                        Layer: layer,
                                        Sensor: sensor
                                    };
                                    info.Entries.push(entry);
                                }
                                this._overlapInstances.push(info);
                            }
                        }
                        this._isOverlapped = true;
                    };
                    LoadingOverlapPlugin.prototype.createOverlap = function (efor, templateId) {
                        var element = this.MasterTable.Renderer.Modifier.createElement(this.MasterTable.Renderer.renderToString(templateId, null));
                        var mezx = null;
                        if (efor.currentStyle)
                            mezx = efor.currentStyle.zIndex;
                        else if (window.getComputedStyle) {
                            mezx = window.getComputedStyle(element, null).zIndex;
                        }
                        element.style.position = "absolute";
                        element.style.display = "block";
                        element.style.zIndex = (parseInt(mezx) + 1).toString();
                        window.document.body.appendChild(element);
                        this.updateCoords(element, efor);
                        return element;
                    };
                    LoadingOverlapPlugin.prototype.updateCoords = function (overlapLayer, overlapElement) {
                        overlapLayer.style.display = "none";
                        var eo = overlapElement.getBoundingClientRect();
                        var bodyrect = document.body.getBoundingClientRect();
                        overlapLayer.style.left = (eo.left - bodyrect.left) + 'px';
                        overlapLayer.style.top = (eo.top - bodyrect.top) + 'px';
                        overlapLayer.style.width = eo.width + 'px';
                        overlapLayer.style.height = eo.height + 'px';
                        overlapLayer.style.display = "block";
                    };
                    LoadingOverlapPlugin.prototype.updateCoordsAll = function () {
                        for (var j = 0; j < this._overlapInstances.length; j++) {
                            for (var l = 0; l < this._overlapInstances[j].Entries.length; l++) {
                                var entry = this._overlapInstances[j].Entries[l];
                                this.updateCoords(entry.Layer, entry.Element);
                            }
                        }
                    };
                    LoadingOverlapPlugin.prototype.deoverlap = function () {
                        if (!this._isOverlapped)
                            return;
                        for (var j = 0; j < this._overlapInstances.length; j++) {
                            for (var l = 0; l < this._overlapInstances[j].Entries.length; l++) {
                                var entry = this._overlapInstances[j].Entries[l];
                                window.document.body.removeChild(entry.Layer);
                            }
                        }
                        this._overlapInstances = [];
                        this._isOverlapped = false;
                    };
                    LoadingOverlapPlugin.prototype.onBeforeLoading = function (e) {
                        this.overlapAll();
                    };
                    return LoadingOverlapPlugin;
                }(Reinforced.Lattice.Plugins.PluginBase));
                LoadingOverlap.LoadingOverlapPlugin = LoadingOverlapPlugin;
                Lattice.ComponentsContainer.registerComponent('LoadingOverlap', LoadingOverlapPlugin);
            })(LoadingOverlap = Plugins.LoadingOverlap || (Plugins.LoadingOverlap = {}));
        })(Plugins = Lattice.Plugins || (Lattice.Plugins = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Plugins;
        (function (Plugins) {
            var Loading;
            (function (Loading) {
                var LoadingPlugin = (function (_super) {
                    __extends(LoadingPlugin, _super);
                    function LoadingPlugin() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    LoadingPlugin.prototype.subscribe = function (e) {
                        var _this = this;
                        e.Loading.subscribeBefore(function () { return _this.showLoadingIndicator(); }, 'loading');
                        e.Loading.subscribeAfter(function () { return _this.hideLoadingIndicator(); }, 'loading');
                        e.LayoutRendered.subscribeAfter(function () {
                            _this.hideLoadingIndicator();
                        }, 'loading');
                    };
                    LoadingPlugin.prototype.showLoadingIndicator = function () {
                        this.MasterTable.Renderer.Modifier.showElement(this.BlinkElement);
                    };
                    LoadingPlugin.prototype.hideLoadingIndicator = function () {
                        this.MasterTable.Renderer.Modifier.hideElement(this.BlinkElement);
                    };
                    LoadingPlugin.prototype.renderContent = function (p) {
                        this.defaultRender(p);
                    };
                    LoadingPlugin.Id = 'Loading';
                    return LoadingPlugin;
                }(Reinforced.Lattice.Plugins.PluginBase));
                Loading.LoadingPlugin = LoadingPlugin;
                Lattice.ComponentsContainer.registerComponent('Loading', LoadingPlugin);
            })(Loading = Plugins.Loading || (Plugins.Loading = {}));
        })(Plugins = Lattice.Plugins || (Lattice.Plugins = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Plugins;
        (function (Plugins) {
            var MouseSelect;
            (function (MouseSelect) {
                var MouseSelectPlugin = (function (_super) {
                    __extends(MouseSelectPlugin, _super);
                    function MouseSelectPlugin() {
                        var _this = _super !== null && _super.apply(this, arguments) || this;
                        _this._isAwaitingSelection = false;
                        _this.afterDrawn = function (a) {
                            Reinforced.Lattice.Services.EventsDelegatorService.addHandler(_this.MasterTable.Renderer.RootElement, "mousedown", function (e) {
                                _this._isAwaitingSelection = true;
                                setTimeout(function () {
                                    if (!_this._isAwaitingSelection)
                                        return;
                                    if (!_this._isSelecting) {
                                        e.stopPropagation();
                                        e.preventDefault();
                                    }
                                    _this.selectStart(e.pageX, e.pageY);
                                }, 10);
                                return true;
                            });
                            Reinforced.Lattice.Services.EventsDelegatorService.addHandler(_this.MasterTable.Renderer.RootElement, "mousemove", function (e) {
                                if (_this._isSelecting) {
                                    e.stopPropagation();
                                    e.preventDefault();
                                }
                                _this.move(e.pageX, e.pageY);
                                return true;
                            });
                            Reinforced.Lattice.Services.EventsDelegatorService.addHandler(document.documentElement, "mouseup", function (e) {
                                _this._isAwaitingSelection = false;
                                _this.selectEnd();
                                if (_this._isSelecting) {
                                    e.stopPropagation();
                                    e.preventDefault();
                                }
                                return true;
                            });
                        };
                        return _this;
                    }
                    MouseSelectPlugin.prototype.init = function (masterTable) {
                        _super.prototype.init.call(this, masterTable);
                    };
                    MouseSelectPlugin.prototype.selectStart = function (x, y) {
                        if (this._isSelecting) {
                            this.selectEnd();
                            return;
                        }
                        this.selectPane = this.MasterTable.Renderer.Modifier
                            .createElement(this.MasterTable.Renderer.renderToString(this.RawConfig.TemplateId, null));
                        this.selectPane.style.left = x + 'px';
                        this.selectPane.style.top = y + 'px';
                        this.selectPane.style.width = '0';
                        this.selectPane.style.height = '0';
                        this.selectPane.style.position = 'absolute';
                        this.selectPane.style.zIndex = '9999';
                        this.selectPane.style.pointerEvents = 'none';
                        this.originalX = x;
                        this.originalY = y;
                        document.body.appendChild(this.selectPane);
                        this._isSelecting = true;
                    };
                    MouseSelectPlugin.prototype.move = function (x, y) {
                        if (!this._isSelecting)
                            return;
                        var cx = (x <= this.originalX) ? x : this.originalX;
                        var cy = (y <= this.originalY) ? y : this.originalY;
                        var nx = (x >= this.originalX) ? x : this.originalX;
                        var ny = (y >= this.originalY) ? y : this.originalY;
                        this.selectPane.style.left = cx + 'px';
                        this.selectPane.style.top = cy + 'px';
                        this.selectPane.style.width = (nx - cx) + 'px';
                        this.selectPane.style.height = (ny - cy) + 'px';
                    };
                    MouseSelectPlugin.prototype.selectEnd = function () {
                        if (!this._isSelecting)
                            return;
                        document.body.removeChild(this.selectPane);
                        this._isSelecting = false;
                    };
                    return MouseSelectPlugin;
                }(Reinforced.Lattice.Plugins.PluginBase));
                MouseSelect.MouseSelectPlugin = MouseSelectPlugin;
                Lattice.ComponentsContainer.registerComponent('MouseSelect', MouseSelectPlugin);
            })(MouseSelect = Plugins.MouseSelect || (Plugins.MouseSelect = {}));
        })(Plugins = Lattice.Plugins || (Lattice.Plugins = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Plugins;
        (function (Plugins) {
            var NativeScroll;
            (function (NativeScroll) {
                var NativeScrollPlugin = (function (_super) {
                    __extends(NativeScrollPlugin, _super);
                    function NativeScrollPlugin() {
                        var _this = _super !== null && _super.apply(this, arguments) || this;
                        _this._previousAmout = 0;
                        _this._block = false;
                        _this.time = Date.now();
                        _this.prevPos = null;
                        _this._onScrollBound = null;
                        return _this;
                    }
                    NativeScrollPlugin.prototype.adjustScrollerHeight = function (skip) {
                        if (skip == null)
                            skip = this.MasterTable.Partition.Skip;
                        this._previousAmout = this.MasterTable.Partition.amount();
                        this.szBefore(this.beforeSize(skip));
                        this.szAfter(this.afterSize(skip));
                    };
                    NativeScrollPlugin.prototype.totalSize = function () {
                        var total = this.MasterTable.Partition.amount();
                        return total * this.Configuration.ElementSize;
                    };
                    NativeScrollPlugin.prototype.afterSize = function (skip) {
                        var total = this.MasterTable.Partition.amount();
                        return (total - this.MasterTable.Partition.Take - skip) *
                            this.Configuration.ElementSize;
                    };
                    NativeScrollPlugin.prototype.beforeSize = function (skip) {
                        return skip * this.Configuration.ElementSize;
                    };
                    NativeScrollPlugin.prototype.szBefore = function (size) {
                        return this.sz(this._before, size);
                    };
                    NativeScrollPlugin.prototype.szAfter = function (size) {
                        return this.sz(this._after, size);
                    };
                    NativeScrollPlugin.prototype.sz = function (element, size) {
                        if (size == null) {
                            var x = element.getBoundingClientRect();
                            if (this.Configuration.IsHorizontal)
                                return x.width;
                            return x.height;
                        }
                        else {
                            if (this.Configuration.IsHorizontal)
                                element.style.width = (Math.floor(size) + 'px');
                            else
                                element.style.height = (Math.floor(size) + 'px');
                            return size;
                        }
                    };
                    NativeScrollPlugin.prototype.hideScroll = function () {
                        this._isHidden = true;
                        if (this.Configuration.IsHorizontal) {
                            this._scrollContainer.style.overflowX = 'hidden';
                        }
                        else {
                            this._scrollContainer.style.overflowY = 'hidden';
                        }
                    };
                    NativeScrollPlugin.prototype.showScroll = function () {
                        if (!this._isHidden)
                            return;
                        if (this.Configuration.IsHorizontal) {
                            this._scrollContainer.style.overflowX = 'auto';
                        }
                        else {
                            this._scrollContainer.style.overflowY = 'auto';
                        }
                    };
                    NativeScrollPlugin.prototype.init = function (masterTable) {
                        _super.prototype.init.call(this, masterTable);
                    };
                    NativeScrollPlugin.prototype.onScroll = function (e) {
                        if (this._block)
                            return;
                        var scroll = e.target.scrollTop;
                        if (this.prevPos == null) {
                            this.prevPos = scroll;
                            return;
                        }
                        if (Math.abs(this.prevPos - scroll) < this.Configuration.ElementSize)
                            return;
                        if (this.Configuration.ScrollThrottle > 0 && (this.time + this.Configuration.ScrollThrottle - Date.now() >= 0))
                            return;
                        this.time = Date.now();
                        e.preventDefault();
                        e.stopPropagation();
                        this._block = true;
                        this.MasterTable.Partition.setSkip(scroll / this.Configuration.ElementSize);
                        this.prevPos = scroll;
                        this._block = false;
                    };
                    NativeScrollPlugin.prototype.onPartitionChange = function (e) {
                        if (!this.MasterTable.DataHolder.Ordered
                            || (this.MasterTable.Partition.isClient() && this.MasterTable.DataHolder.Ordered.length <= e.MasterTable.Partition.Take)
                            || this.MasterTable.DataHolder.DisplayedData.length === 0
                            || e.EventArgs.Take === 0) {
                            this.hideScroll();
                            return;
                        }
                        else {
                            this.showScroll();
                        }
                        this.adjustScrollerHeight();
                    };
                    NativeScrollPlugin.prototype.onClientDataProcessing = function (e) {
                        if (e.EventArgs.OnlyPartitionPerformed)
                            return;
                        if (e.MasterTable.Partition.Take === 0
                            || (((this.MasterTable.Partition.Type === Reinforced.Lattice.PartitionType.Client) || (this.MasterTable.Partition.Type === Reinforced.Lattice.PartitionType.Sequential))
                                && e.EventArgs.Ordered.length <= e.MasterTable.Partition.Take)
                            || e.EventArgs.Displaying.length === 0) {
                            this.hideScroll();
                            return;
                        }
                        else {
                            this.showScroll();
                        }
                        this.adjustScrollerHeight();
                    };
                    NativeScrollPlugin.prototype.subscribe = function (e) {
                        e.LayoutRendered.subscribeAfter(this.onLayoutRendered.bind(this), 'nscroll');
                        e.PartitionChanged.subscribeAfter(this.onPartitionChange.bind(this), 'nscroll');
                        e.ClientDataProcessing.subscribeAfter(this.onClientDataProcessing.bind(this), 'nscroll');
                    };
                    NativeScrollPlugin.prototype.onLayoutRendered = function (e) {
                        var bdyParent = this.MasterTable.Renderer.BodyElement.parentElement;
                        this._before = document.createElement('div');
                        this._before.style.visibility = 'hidden';
                        this._before.style.opacity = '0';
                        bdyParent.insertBefore(this._before, this.MasterTable.Renderer.BodyElement);
                        this._after = document.createElement('div');
                        this._after.style.visibility = 'hidden';
                        this._after.style.opacity = '0';
                        bdyParent.appendChild(this._after);
                        this._scrollContainer = bdyParent;
                        this._onScrollBound = this.onScroll.bind(this);
                        Reinforced.Lattice.Services.EventsDelegatorService.addHandler(this._scrollContainer, 'scroll', this._onScrollBound);
                    };
                    return NativeScrollPlugin;
                }(Reinforced.Lattice.Plugins.PluginBase));
                NativeScroll.NativeScrollPlugin = NativeScrollPlugin;
                Lattice.ComponentsContainer.registerComponent('NativeScroll', NativeScrollPlugin);
            })(NativeScroll = Plugins.NativeScroll || (Plugins.NativeScroll = {}));
        })(Plugins = Lattice.Plugins || (Lattice.Plugins = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Plugins;
        (function (Plugins) {
            var Ordering;
            (function (Ordering) {
                var OrderingPlugin = (function (_super) {
                    __extends(OrderingPlugin, _super);
                    function OrderingPlugin() {
                        var _this = _super !== null && _super.apply(this, arguments) || this;
                        _this._clientOrderings = {};
                        _this._serverOrderings = {};
                        return _this;
                    }
                    OrderingPlugin.prototype.subscribe = function (e) {
                        var _this = this;
                        e.ColumnsCreation.subscribe(function (v) {
                            _this.overrideHeadersTemplates(v.EventArgs);
                        }, 'ordering');
                    };
                    OrderingPlugin.prototype.overrideHeadersTemplates = function (columns) {
                        var _this = this;
                        var templId = this.RawConfig.TemplateId;
                        for (var ck in columns) {
                            if (columns.hasOwnProperty(ck)) {
                                var ordering = this.Configuration.OrderingsForColumns[ck];
                                if (ordering == null || ordering == undefined)
                                    continue;
                                this.updateOrdering(ck, ordering.DefaultOrdering);
                                if (columns[ck].Configuration.IsDataOnly)
                                    continue;
                                if (ordering.Hidden)
                                    continue;
                                var newHeader = {
                                    Column: columns[ck],
                                    switchOrdering: function (e) {
                                        _this.switchOrderingForColumn(e.Receiver.Column.RawName);
                                    },
                                    TemplateIdOverride: templId,
                                    IsClientOrdering: this.isClient(ck)
                                };
                                this.specifyOrdering(newHeader, ordering.DefaultOrdering);
                                columns[ck].Header = newHeader;
                            }
                        }
                    };
                    OrderingPlugin.prototype.updateOrdering = function (columnName, ordering) {
                        if (this.isClient(columnName))
                            this._clientOrderings[columnName] = ordering;
                        else
                            this._serverOrderings[columnName] = ordering;
                    };
                    OrderingPlugin.prototype.specifyOrdering = function (object, ordering) {
                        object.IsNeutral = object.IsDescending = object.IsAscending = false;
                        switch (ordering) {
                            case Reinforced.Lattice.Ordering.Neutral:
                                object.IsNeutral = true;
                                break;
                            case Reinforced.Lattice.Ordering.Descending:
                                object.IsDescending = true;
                                break;
                            case Reinforced.Lattice.Ordering.Ascending:
                                object.IsAscending = true;
                                break;
                        }
                    };
                    OrderingPlugin.prototype.isClient = function (columnName) {
                        return this.Configuration.OrderingsForColumns.hasOwnProperty(columnName)
                            && this.Configuration.OrderingsForColumns[columnName].IsClient;
                    };
                    OrderingPlugin.prototype.switchOrderingForColumn = function (columnName) {
                        if (this.Configuration.OrderingsForColumns[columnName] == null || this.Configuration.OrderingsForColumns[columnName] == undefined)
                            throw new Error("Ordering is not configured for column " + columnName);
                        var orderingsCollection = this.isClient(columnName) ? this._clientOrderings : this._serverOrderings;
                        var next = this.nextOrdering(orderingsCollection[columnName]);
                        this.setOrderingForColumn(columnName, next);
                    };
                    OrderingPlugin.prototype.updateOrderingWithUi = function (columnName, ordering) {
                        var coolHeader = this.MasterTable.InstanceManager.Columns[columnName].Header;
                        this.specifyOrdering(coolHeader, ordering);
                        this.updateOrdering(columnName, ordering);
                        this.MasterTable.Renderer.Modifier.redrawHeader(coolHeader.Column);
                    };
                    OrderingPlugin.prototype.setOrderingForColumn = function (columnName, ordering) {
                        this.updateOrderingWithUi(columnName, ordering);
                        if (this.Configuration.RadioOrdering) {
                            for (var ck in this.Configuration.OrderingsForColumns) {
                                if ((ck !== columnName)
                                    && (!this.MasterTable.InstanceManager.Columns[ck].Configuration.IsDataOnly)
                                    && !this.Configuration.OrderingsForColumns[ck].Hidden) {
                                    this.updateOrderingWithUi(ck, Reinforced.Lattice.Ordering.Neutral);
                                }
                            }
                        }
                        this.MasterTable.Controller.reload();
                    };
                    OrderingPlugin.prototype.nextOrdering = function (currentOrdering) {
                        switch (currentOrdering) {
                            case Reinforced.Lattice.Ordering.Neutral: return Reinforced.Lattice.Ordering.Ascending;
                            case Reinforced.Lattice.Ordering.Descending: return Reinforced.Lattice.Ordering.Neutral;
                            case Reinforced.Lattice.Ordering.Ascending: return Reinforced.Lattice.Ordering.Descending;
                        }
                    };
                    OrderingPlugin.prototype.makeDefaultOrderingFunction = function (fieldName) {
                        var self = this;
                        return (function (field) {
                            return function (a, b) {
                                var x = a[field], y = b[field];
                                if (x === y)
                                    return 0;
                                if (x == null || x == undefined)
                                    return -1;
                                if (y == null || y == undefined)
                                    return 1;
                                if (typeof x === "string") {
                                    return x.localeCompare(y);
                                }
                                return (x > y) ? 1 : -1;
                            };
                        })(fieldName);
                    };
                    OrderingPlugin.prototype.init = function (masterTable) {
                        _super.prototype.init.call(this, masterTable);
                        var hasClientOrderings = false;
                        var fn;
                        for (var cls in this.Configuration.OrderingsForColumns) {
                            if (this.Configuration.OrderingsForColumns.hasOwnProperty(cls)) {
                                hasClientOrderings = true;
                                var ordering = this.Configuration.OrderingsForColumns[cls];
                                fn = ordering.Function;
                                if (!fn) {
                                    fn = this.makeDefaultOrderingFunction(cls);
                                    ordering.Function = fn;
                                }
                                this.MasterTable.DataHolder.registerClientOrdering(cls, fn, false, ordering.Priority);
                            }
                        }
                        if (hasClientOrderings) {
                            for (var serverColumn in this.Configuration.OrderingsForColumns) {
                                if (this.isClient(serverColumn))
                                    continue;
                                fn = this.makeDefaultOrderingFunction(serverColumn);
                                this.MasterTable.DataHolder.registerClientOrdering(serverColumn, fn);
                            }
                        }
                    };
                    OrderingPlugin.prototype.mixinOrderings = function (orderingsCollection, query) {
                        for (var clo in orderingsCollection) {
                            if (orderingsCollection.hasOwnProperty(clo)) {
                                query.Orderings[clo] = orderingsCollection[clo];
                            }
                        }
                    };
                    OrderingPlugin.prototype.modifyQuery = function (query, scope) {
                        this.mixinOrderings(this._serverOrderings, query);
                        if (scope === Lattice.QueryScope.Client || scope === Lattice.QueryScope.Transboundary) {
                            this.mixinOrderings(this._clientOrderings, query);
                        }
                    };
                    return OrderingPlugin;
                }(Reinforced.Lattice.Filters.FilterBase));
                Ordering.OrderingPlugin = OrderingPlugin;
                Lattice.ComponentsContainer.registerComponent('Ordering', OrderingPlugin);
            })(Ordering = Plugins.Ordering || (Plugins.Ordering = {}));
        })(Plugins = Lattice.Plugins || (Lattice.Plugins = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Plugins;
        (function (Plugins) {
            var Paging;
            (function (Paging) {
                var PagingPlugin = (function (_super) {
                    __extends(PagingPlugin, _super);
                    function PagingPlugin() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    PagingPlugin.prototype.CurrentPage = function () { return this.MasterTable.Stats.CurrentPage() + 1; };
                    PagingPlugin.prototype.TotalPages = function () { return this.MasterTable.Stats.Pages(); };
                    PagingPlugin.prototype.PageSize = function () { return this.MasterTable.Partition.Take; };
                    PagingPlugin.prototype.goToPage = function (page) {
                        var pg = parseInt(page);
                        this.MasterTable.Partition.setSkip(pg * this.MasterTable.Partition.Take, false);
                    };
                    PagingPlugin.prototype.gotoPageClick = function (e) {
                        if (this.GotoInput) {
                            var v = this.GotoInput.value;
                            v = (parseInt(v) - 1).toString();
                            this.goToPage(v);
                        }
                    };
                    PagingPlugin.prototype.navigateToPage = function (e) {
                        this.goToPage(e.EventArguments[0]);
                    };
                    PagingPlugin.prototype.nextClick = function (e) {
                        if (this.MasterTable.Stats.CurrentPage() < this.MasterTable.Stats.Pages())
                            this.goToPage((this.MasterTable.Stats.CurrentPage() + 1).toString());
                    };
                    PagingPlugin.prototype.previousClick = function (e) {
                        if (this.MasterTable.Stats.CurrentPage() > 0)
                            this.goToPage((this.MasterTable.Stats.CurrentPage() - 1).toString());
                    };
                    PagingPlugin.prototype.constructPagesElements = function () {
                        var a = [];
                        var total = this.MasterTable.Stats.Pages();
                        var cur = this.MasterTable.Stats.CurrentPage();
                        var pdiff = this.Configuration.PagesToHideUnderPeriod;
                        var totalKnown = this.MasterTable.Partition.isAmountFinite();
                        if (total > 1) {
                            this.Shown = true;
                            if (!this.Configuration.ArrowsMode) {
                                if (this.Configuration.UseFirstLastPage)
                                    a.push({ Page: 0, First: true });
                                if (cur > 0)
                                    a.push({ Page: 0, Prev: true });
                                if (this.Configuration.UsePeriods) {
                                    if (cur - 1 >= pdiff)
                                        a.push({ Page: 0, Period: true });
                                    if (cur - 1 > 0)
                                        a.push({ Page: cur - 1, InActivePage: true });
                                    a.push({ Page: cur, ActivePage: true });
                                    if (cur + 1 < total)
                                        a.push({ Page: cur + 1, InActivePage: true });
                                    if (total - (cur + 1) >= pdiff)
                                        a.push({ Page: 0, Period: true });
                                }
                                else {
                                    for (var i = 0; i < total; i++) {
                                        if (cur === i) {
                                            a.push({ Page: i, ActivePage: true });
                                        }
                                        else {
                                            a.push({ Page: i, InActivePage: true });
                                        }
                                    }
                                    if (!totalKnown) {
                                        a.push({ Page: 0, Period: true });
                                    }
                                }
                                if (cur < total - 1)
                                    a.push({ Page: 0, Next: true });
                                if (this.Configuration.UseFirstLastPage && totalKnown)
                                    a.push({ Page: total - 1, Last: true });
                                var disFunction = function () { return this.Page + 1; };
                                for (var j = 0; j < a.length; j++) {
                                    a[j].DisPage = disFunction;
                                }
                                this.Pages = a;
                            }
                            else {
                                this.NextArrow = totalKnown ? cur < total - 1 : true;
                                this.PrevArrow = cur > 0;
                            }
                        }
                        else {
                            this.Shown = false;
                        }
                    };
                    PagingPlugin.prototype.renderContent = function (p) {
                        this.constructPagesElements();
                        _super.prototype.defaultRender.call(this, p);
                    };
                    PagingPlugin.prototype.validateGotopage = function () {
                        var v = this.GotoInput.value;
                        var i = parseInt(v);
                        var valid = this.MasterTable.Partition.isAmountFinite() ? (!isNaN(i) && (i > 0) && (i <= this.MasterTable.Stats.Pages())) : true;
                        if (valid) {
                            this.VisualStates.normalState();
                        }
                        else {
                            this.VisualStates.changeState('invalid');
                        }
                    };
                    PagingPlugin.prototype.init = function (masterTable) {
                        _super.prototype.init.call(this, masterTable);
                    };
                    PagingPlugin.prototype.onPartitionChanged = function (e) {
                        if (e.EventArgs.Take === e.EventArgs.PreviousTake && e.EventArgs.Skip === e.EventArgs.PreviousSkip)
                            return;
                        this.MasterTable.Renderer.Modifier.redrawPlugin(this);
                    };
                    PagingPlugin.prototype.onClientDataProcessing = function (e) {
                        this.MasterTable.Renderer.Modifier.redrawPlugin(this);
                    };
                    PagingPlugin.prototype.subscribe = function (e) {
                        e.PartitionChanged.subscribeAfter(this.onPartitionChanged.bind(this), 'paging');
                        e.ClientDataProcessing.subscribeAfter(this.onClientDataProcessing.bind(this), 'paging');
                    };
                    return PagingPlugin;
                }(Reinforced.Lattice.Plugins.PluginBase));
                Paging.PagingPlugin = PagingPlugin;
                Lattice.ComponentsContainer.registerComponent('Paging', PagingPlugin);
            })(Paging = Plugins.Paging || (Plugins.Paging = {}));
        })(Plugins = Lattice.Plugins || (Lattice.Plugins = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Plugins;
        (function (Plugins) {
            var RegularSelect;
            (function (RegularSelect) {
                var RegularSelectPlugin = (function (_super) {
                    __extends(RegularSelectPlugin, _super);
                    function RegularSelectPlugin() {
                        var _this = _super !== null && _super.apply(this, arguments) || this;
                        _this._isSelecting = false;
                        _this._reset = false;
                        _this._prevUiCols = [];
                        return _this;
                    }
                    RegularSelectPlugin.prototype.init = function (masterTable) {
                        _super.prototype.init.call(this, masterTable);
                    };
                    RegularSelectPlugin.prototype.startSelection = function (e) {
                        this._isSelecting = true;
                        this._startRow = e.Row;
                        this._startColumn = e.Column;
                        this._endRow = e.Row;
                        this._endColumn = this.MasterTable.InstanceManager.getColumnByOrder(e.Column).UiOrder;
                        this._reset = false;
                        e.OriginalEvent.preventDefault();
                    };
                    RegularSelectPlugin.prototype.endSelection = function (e) {
                        this._isSelecting = false;
                        e.OriginalEvent.preventDefault();
                    };
                    RegularSelectPlugin.prototype.diff = function (row, column) {
                        var select, rngStart, rngEnd;
                        if (this.Configuration.Mode === RegularSelect.RegularSelectMode.Rows) {
                            select = Math.abs(this._endRow - this._startRow) < Math.abs(row - this._startRow);
                            rngStart = row < this._endRow ? row : this._endRow;
                            rngEnd = row > this._endRow ? row : this._endRow;
                            for (var i = rngStart; i <= rngEnd; i++) {
                                this.MasterTable.Selection.toggleDisplayingRow(i, select);
                            }
                            this._endRow = row;
                            this._endColumn = column;
                        }
                        else {
                            select = Math.abs(this._endRow - this._startRow) < Math.abs(row - this._startRow);
                            rngStart = row < this._endRow ? row : this._endRow;
                            rngEnd = row > this._endRow ? row : this._endRow;
                            var selColumns = [];
                            var colMin = this._startColumn < column ? this._startColumn : column;
                            var colMax = this._startColumn > column ? this._startColumn : column;
                            var uiCols = this.MasterTable.InstanceManager.getColumnNames();
                            for (var j = colMin; j <= colMax; j++) {
                                if (!this.MasterTable.InstanceManager.Columns[uiCols[j]].Configuration.IsDataOnly) {
                                    selColumns.push(this.MasterTable.InstanceManager.Columns[uiCols[j]].RawName);
                                }
                            }
                            if (!select) {
                                for (var k = rngStart; k <= rngEnd; k++) {
                                    this.MasterTable.Selection.toggleDisplayingRow(k, false);
                                }
                            }
                            var rowMin = this._startRow < row ? this._startRow : row;
                            var rowMax = this._startRow > row ? this._startRow : row;
                            for (var n = rowMin; n <= rowMax; n++) {
                                this.MasterTable.Selection.setCellsByDisplayIndex(n, selColumns);
                            }
                            this._prevUiCols = selColumns;
                            this._endRow = row;
                            this._endColumn = column;
                        }
                    };
                    RegularSelectPlugin.prototype.move = function (e) {
                        if (!this._isSelecting)
                            return;
                        if (!this._reset) {
                            this.MasterTable.Selection.resetSelection();
                            this._reset = true;
                        }
                        this.diff(e.Row, e.Column);
                        e.OriginalEvent.preventDefault();
                    };
                    return RegularSelectPlugin;
                }(Reinforced.Lattice.Plugins.PluginBase));
                RegularSelect.RegularSelectPlugin = RegularSelectPlugin;
                Lattice.ComponentsContainer.registerComponent('RegularSelect', RegularSelectPlugin);
            })(RegularSelect = Plugins.RegularSelect || (Plugins.RegularSelect = {}));
        })(Plugins = Lattice.Plugins || (Lattice.Plugins = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Plugins;
        (function (Plugins) {
            var Reload;
            (function (Reload) {
                var ReloadPlugin = (function (_super) {
                    __extends(ReloadPlugin, _super);
                    function ReloadPlugin() {
                        var _this = _super !== null && _super.apply(this, arguments) || this;
                        _this.afterDrawn = function (e) {
                            if (_this._renderedExternally) {
                                _this._externalReloadBtn = new ReloadButton(_this.MasterTable.Controller, _this.Configuration.ForceReload);
                                _this.MasterTable.Renderer.renderObject(_this.RawConfig.TemplateId, _this._externalReloadBtn, _this.Configuration.RenderTo);
                                _this._ready = true;
                            }
                        };
                        return _this;
                    }
                    ReloadPlugin.prototype.triggerReload = function () {
                        this.MasterTable.Controller.reload(this.Configuration.ForceReload);
                    };
                    ReloadPlugin.prototype.renderContent = function (p) {
                        if (this._renderedExternally)
                            return;
                        this.defaultRender(p);
                    };
                    ReloadPlugin.prototype.startLoading = function () {
                        if (this._renderedExternally) {
                            if (!this._ready)
                                return;
                            if (this._externalReloadBtn.VisualStates)
                                this._externalReloadBtn.VisualStates.mixinState('loading');
                        }
                        else {
                            if (this.VisualStates)
                                this.VisualStates.mixinState('loading');
                        }
                    };
                    ReloadPlugin.prototype.stopLoading = function () {
                        if (this._renderedExternally) {
                            if (!this._ready)
                                return;
                            if (this._externalReloadBtn.VisualStates)
                                this._externalReloadBtn.VisualStates.unmixinState('loading');
                        }
                        else {
                            if (this.VisualStates)
                                this.VisualStates.unmixinState('loading');
                        }
                    };
                    ReloadPlugin.prototype.subscribe = function (e) {
                        var _this = this;
                        _super.prototype.subscribe.call(this, e);
                        e.Loading.subscribeBefore(function () { return _this.startLoading(); }, 'reload');
                        e.Loading.subscribeAfter(function () { return _this.stopLoading(); }, 'reload');
                        e.LayoutRendered.subscribeAfter(function () {
                            _this.stopLoading();
                        }, 'reload');
                    };
                    ReloadPlugin.prototype.init = function (masterTable) {
                        _super.prototype.init.call(this, masterTable);
                        this._renderedExternally = this.Configuration.RenderTo != null && this.Configuration.RenderTo != undefined && this.Configuration.RenderTo.length > 0;
                    };
                    return ReloadPlugin;
                }(Reinforced.Lattice.Plugins.PluginBase));
                Reload.ReloadPlugin = ReloadPlugin;
                var ReloadButton = (function () {
                    function ReloadButton(controller, forceReload) {
                        this._controller = controller;
                        this._forceReload = forceReload;
                    }
                    ReloadButton.prototype.triggerReload = function () {
                        this._controller.reload(this._forceReload);
                    };
                    return ReloadButton;
                }());
                Lattice.ComponentsContainer.registerComponent('Reload', ReloadPlugin);
            })(Reload = Plugins.Reload || (Plugins.Reload = {}));
        })(Plugins = Lattice.Plugins || (Lattice.Plugins = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Plugins;
        (function (Plugins) {
            var ResponseInfo;
            (function (ResponseInfo) {
                var ResponseInfoPlugin = (function (_super) {
                    __extends(ResponseInfoPlugin, _super);
                    function ResponseInfoPlugin() {
                        var _this = _super !== null && _super.apply(this, arguments) || this;
                        _this._recentData = {};
                        _this._isReadyForRendering = false;
                        return _this;
                    }
                    ResponseInfoPlugin.prototype.onResponse = function (e) {
                        this._isServerRequest = true;
                        if (!this.Configuration.ResponseObjectOverriden) {
                            this._recentServerData = this.MasterTable.Stats;
                        }
                    };
                    ResponseInfoPlugin.prototype.addClientData = function (e) {
                        for (var k in this.Configuration.ClientCalculators) {
                            if (this.Configuration.ClientCalculators.hasOwnProperty(k)) {
                                this._recentData[k] = this.Configuration.ClientCalculators[k](e);
                            }
                        }
                    };
                    ResponseInfoPlugin.prototype.onClientDataProcessed = function (e) {
                        if (this.Configuration.ResponseObjectOverriden) {
                            this.addClientData(e.EventArgs);
                            this.MasterTable.Renderer.Modifier.redrawPlugin(this);
                            return;
                        }
                        this._recentData = this.MasterTable.Stats;
                        this.addClientData(e.EventArgs);
                        this._isServerRequest = false;
                        this._isReadyForRendering = true;
                        this.MasterTable.Renderer.Modifier.redrawPlugin(this);
                    };
                    ResponseInfoPlugin.prototype.renderContent = function (p) {
                        if (!this._isReadyForRendering)
                            return;
                        if (this.Configuration.ClientTemplateFunction) {
                            p.w(this.Configuration.ClientTemplateFunction(this._recentData));
                        }
                        else {
                            p.nest(this._recentData, this._recentTemplate);
                        }
                    };
                    ResponseInfoPlugin.prototype.init = function (masterTable) {
                        _super.prototype.init.call(this, masterTable);
                        this._recentTemplate = this.RawConfig.TemplateId;
                        if (this.Configuration.ResponseObjectOverriden) {
                            this.MasterTable.Loader.registerAdditionalDataReceiver('ResponseInfo', this);
                        }
                        this.MasterTable.Events.ClientDataProcessing.subscribeAfter(this.onClientDataProcessed.bind(this), 'responseInfo');
                        this.MasterTable.Events.DataReceived.subscribeBefore(this.onResponse.bind(this), 'responseInfo');
                        try {
                            this._pagingPlugin = this.MasterTable.InstanceManager.getPlugin('Paging');
                            this._pagingEnabled = true;
                        }
                        catch (v) {
                            this._pagingEnabled = false;
                        }
                    };
                    ResponseInfoPlugin.prototype.handleAdditionalData = function (additionalData) {
                        this._recentData = additionalData;
                        this._isReadyForRendering = true;
                        this.MasterTable.Renderer.Modifier.redrawPlugin(this);
                    };
                    return ResponseInfoPlugin;
                }(Reinforced.Lattice.Plugins.PluginBase));
                ResponseInfo.ResponseInfoPlugin = ResponseInfoPlugin;
                Lattice.ComponentsContainer.registerComponent('ResponseInfo', ResponseInfoPlugin);
            })(ResponseInfo = Plugins.ResponseInfo || (Plugins.ResponseInfo = {}));
        })(Plugins = Lattice.Plugins || (Lattice.Plugins = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Plugins;
        (function (Plugins) {
            var Scrollbar;
            (function (Scrollbar) {
                var ScrollbarPlugin = (function (_super) {
                    __extends(ScrollbarPlugin, _super);
                    function ScrollbarPlugin() {
                        var _this = _super !== null && _super.apply(this, arguments) || this;
                        _this._needUpdateCoords = false;
                        _this._availableSpaceRaw = false;
                        _this._availableSpaceRawCorrection = 0;
                        _this._previousAmout = 0;
                        _this._skipOnUp = -1;
                        _this._upArrowActive = false;
                        _this._downArrowActive = false;
                        return _this;
                    }
                    ScrollbarPlugin.prototype.init = function (masterTable) {
                        _super.prototype.init.call(this, masterTable);
                        this.IsVertical = !this.Configuration.IsHorizontal;
                        this._boundScrollerMove = this.scrollerMove.bind(this);
                        this._boundScrollerEnd = this.scrollerEnd.bind(this);
                    };
                    ScrollbarPlugin.prototype.updatePosition = function () {
                        if (!this._scollbar)
                            return;
                        if (!this._stickElement)
                            return;
                        var newCoords = this.getCoords();
                        if (newCoords == null) {
                            this.hideScroll();
                            this._needUpdateCoords = true;
                            return;
                        }
                        else {
                            this._needUpdateCoords = false;
                            if (this._isHiddenForcibly)
                                return;
                            this.showScroll();
                        }
                        this._needUpdateCoords = false;
                        if (newCoords.height != undefined)
                            this._scollbar.style.height = newCoords.height + 'px';
                        if (newCoords.width != undefined)
                            this._scollbar.style.width = newCoords.width + 'px';
                        if (newCoords.left != undefined)
                            this._scollbar.style.left = newCoords.left + 'px';
                        if (newCoords.top != undefined)
                            this._scollbar.style.top = newCoords.top + 'px';
                        this.calculateAvailableSpace();
                        this.adjustScrollerHeight();
                        this.adjustScrollerPosition(this.MasterTable.Partition.FloatingSkip);
                    };
                    ScrollbarPlugin.prototype.adjustScrollerPosition = function (skip) {
                        if (!this.Scroller)
                            return;
                        var total = this.MasterTable.Partition.amount();
                        var d = this._availableSpace / total;
                        var h = d * skip;
                        if (skip <= 0)
                            h = 0;
                        if (this.Configuration.IsHorizontal)
                            this.Scroller.style.left = h + 'px';
                        else
                            this.Scroller.style.top = h + 'px';
                        this._scrollerPos = h;
                    };
                    ScrollbarPlugin.prototype.adjustScrollerHeight = function () {
                        if (!this.Scroller)
                            return;
                        var total = this.MasterTable.Partition.amount();
                        this._previousAmout = total;
                        if (!this._availableSpaceRaw) {
                            this._availableSpace += this._availableSpaceRawCorrection;
                            this._availableSpaceRaw = true;
                        }
                        var sz = (this.MasterTable.Partition.Take * this._availableSpace) / total;
                        if (sz < this.Configuration.ScrollerMinSize) {
                            var osz = sz;
                            sz = this.Configuration.ScrollerMinSize;
                            this._availableSpace -= (sz - osz);
                            this._availableSpaceRawCorrection = (sz - osz);
                            this._availableSpaceRaw = false;
                            this.adjustScrollerPosition(this.MasterTable.Partition.FloatingSkip);
                        }
                        if (this.Configuration.IsHorizontal)
                            this.Scroller.style.width = sz + 'px';
                        else
                            this.Scroller.style.height = sz + 'px';
                        this._scrollerSize = sz;
                    };
                    ScrollbarPlugin.prototype.calculateAvailableSpace = function () {
                        var box = this._scollbar.getBoundingClientRect();
                        var aspace = this.Configuration.IsHorizontal ? box.width : box.height;
                        if (this.UpArrow) {
                            box = this.UpArrow.getBoundingClientRect();
                            aspace -= this.Configuration.IsHorizontal ? box.width : box.height;
                        }
                        if (this.DownArrow) {
                            box = this.DownArrow.getBoundingClientRect();
                            aspace -= this.Configuration.IsHorizontal ? box.width : box.height;
                        }
                        this._availableSpace = aspace;
                        this._availableSpaceRaw = true;
                    };
                    ScrollbarPlugin.prototype.getCoords = function () {
                        var r = {};
                        var erect = this._stickElement.getBoundingClientRect();
                        var nil = true;
                        for (var k in erect) {
                            if (erect[k] !== 0) {
                                nil = false;
                                break;
                            }
                        }
                        if (nil)
                            return null;
                        var c = { top: 0, height: 0, left: 0, width: 0 };
                        if (this.Configuration.AppendToElement === 'body') {
                            var bodyrect = document.body.getBoundingClientRect();
                            c = {
                                top: erect.top - bodyrect.top,
                                height: this._stickElement.clientHeight,
                                left: erect.left - bodyrect.left,
                                width: this._stickElement.clientWidth
                            };
                        }
                        else {
                            var ae = this.getElement(this.Configuration.AppendToElement);
                            var aerect = ae.getBoundingClientRect();
                            c = {
                                top: erect.top - aerect.top,
                                left: erect.left - aerect.left,
                                height: this._stickElement.clientHeight,
                                width: this._stickElement.clientWidth
                            };
                        }
                        switch (this.Configuration.StickDirection) {
                            case Reinforced.Lattice.Plugins.Scrollbar.StickDirection.Right:
                                r.top = c.top;
                                r.height = c.height;
                                switch (this.Configuration.StickHollow) {
                                    case Reinforced.Lattice.Plugins.Scrollbar.StickHollow.External:
                                        r.left = c.left + c.width;
                                        break;
                                    case Reinforced.Lattice.Plugins.Scrollbar.StickHollow.Internal:
                                        r.left = c.left + c.width - this._scrollWidth;
                                        break;
                                }
                                break;
                            case Reinforced.Lattice.Plugins.Scrollbar.StickDirection.Left:
                                r.top = c.top;
                                r.height = c.height;
                                switch (this.Configuration.StickHollow) {
                                    case Reinforced.Lattice.Plugins.Scrollbar.StickHollow.External:
                                        r.left = c.left;
                                        break;
                                    case Reinforced.Lattice.Plugins.Scrollbar.StickHollow.Internal:
                                        r.left = c.left - this._scrollWidth;
                                        break;
                                }
                                break;
                            case Reinforced.Lattice.Plugins.Scrollbar.StickDirection.Top:
                                r.left = c.left;
                                r.width = c.width;
                                switch (this.Configuration.StickHollow) {
                                    case Reinforced.Lattice.Plugins.Scrollbar.StickHollow.External:
                                        r.top = c.top - this._scrollHeight;
                                        break;
                                    case Reinforced.Lattice.Plugins.Scrollbar.StickHollow.Internal:
                                        r.top = c.top;
                                        break;
                                }
                                break;
                            case Reinforced.Lattice.Plugins.Scrollbar.StickDirection.Bottom:
                                r.left = c.left;
                                r.width = c.width;
                                switch (this.Configuration.StickHollow) {
                                    case Reinforced.Lattice.Plugins.Scrollbar.StickHollow.External:
                                        r.top = c.top + c.height;
                                        break;
                                    case Reinforced.Lattice.Plugins.Scrollbar.StickHollow.Internal:
                                        r.top = c.top + c.height - this._scrollHeight;
                                        break;
                                }
                                break;
                        }
                        return r;
                    };
                    ScrollbarPlugin.prototype.getElement = function (configSelect) {
                        if (!configSelect)
                            return null;
                        switch (configSelect) {
                            case '$Body': return this.MasterTable.Renderer.BodyElement;
                            case '$Parent': return this.MasterTable.Renderer.BodyElement.parentElement;
                            case '$All': return this.MasterTable.Renderer.RootElement;
                            case 'document': return document;
                            case 'body': return document.body;
                        }
                        return document.querySelector(configSelect);
                    };
                    ScrollbarPlugin.prototype.onLayoutRendered = function (e) {
                        this._stickElement = this.getElement(this.Configuration.StickToElementSelector);
                        this._kbListener = this.getElement(this.Configuration.KeyboardEventsCatcher);
                        this._wheelListener = this.getElement(this.Configuration.WheelEventsCatcher);
                        this._scollbar = this.MasterTable.Renderer.Modifier.createElementFromTemplate(this.RawConfig.TemplateId, this);
                        var ae = this.getElement(this.Configuration.AppendToElement);
                        if (this.Configuration.AppendToElement === '$All')
                            ae.style.position = 'relative';
                        ae.appendChild(this._scollbar);
                        this.subscribeUiEvents();
                        var style = this._scollbar.style;
                        var coord = this._scollbar.getBoundingClientRect();
                        if (this.Configuration.IsHorizontal) {
                            if (style.height)
                                this._scrollHeight = parseInt(style.height);
                            else
                                this._scrollHeight = coord.height;
                        }
                        else {
                            if (style.width)
                                this._scrollWidth = parseInt(style.width);
                            else
                                this._scrollWidth = coord.width;
                        }
                        this._sensor = new Reinforced.Lattice.Rendering.Resensor(this._stickElement.parentElement, this.updatePosition.bind(this));
                        this.updatePosition();
                        this._sensor.attach();
                    };
                    ScrollbarPlugin.prototype.subscribeUiEvents = function () {
                        if (this.UpArrow) {
                            Reinforced.Lattice.Services.EventsDelegatorService.addHandler(this.UpArrow, 'mousedown', this.upArrowStart.bind(this));
                            Reinforced.Lattice.Services.EventsDelegatorService.addHandler(document.body, 'mouseup', this.upArrowEnd.bind(this));
                            Reinforced.Lattice.Services.EventsDelegatorService.addHandler(this.UpArrow, 'click', this.upArrow.bind(this));
                        }
                        if (this.DownArrow) {
                            Reinforced.Lattice.Services.EventsDelegatorService.addHandler(this.DownArrow, 'mousedown', this.downArrowStart.bind(this));
                            Reinforced.Lattice.Services.EventsDelegatorService.addHandler(document.body, 'mouseup', this.downArrowEnd.bind(this));
                            Reinforced.Lattice.Services.EventsDelegatorService.addHandler(this.DownArrow, 'click', this.downArrow.bind(this));
                        }
                        if (this._wheelListener) {
                            Reinforced.Lattice.Services.EventsDelegatorService
                                .addHandler(this._wheelListener, 'wheel', this.handleWheel.bind(this));
                        }
                        if (this.Scroller) {
                            Reinforced.Lattice.Services.EventsDelegatorService.addHandler(this.Scroller, 'mousedown', this.scrollerStart.bind(this));
                        }
                        if (this.ScrollerActiveArea) {
                            Reinforced.Lattice.Services.EventsDelegatorService.addHandler(this.ScrollerActiveArea, 'mousedown', this.activeAreaMouseDown.bind(this));
                            Reinforced.Lattice.Services.EventsDelegatorService.addHandler(this.ScrollerActiveArea, 'click', this.activeAreaClick.bind(this));
                        }
                        if (this._kbListener) {
                            Reinforced.Lattice.Services.EventsDelegatorService.addHandler(window, 'keydown', this.keydownHook.bind(this));
                            this._kbListener['enableKeyboardScroll'] = this.enableKb.bind(this);
                            this._kbListener['disableKeyboardScroll'] = this.disableKb.bind(this);
                            if (this.Configuration.FocusMode === Reinforced.Lattice.Plugins.Scrollbar.KeyboardScrollFocusMode.MouseOver) {
                                Reinforced.Lattice.Services.EventsDelegatorService
                                    .addHandler(this._kbListener, 'mouseenter', this._kbListener['enableKeyboardScroll']);
                                Reinforced.Lattice.Services.EventsDelegatorService
                                    .addHandler(this._kbListener, 'mouseleave', this._kbListener['disableKeyboardScroll']);
                            }
                            if (this.Configuration.FocusMode === Reinforced.Lattice.Plugins.Scrollbar.KeyboardScrollFocusMode.MouseClick) {
                                Reinforced.Lattice.Services.EventsDelegatorService.addHandler(window, 'click', this.trackKbListenerClick.bind(this));
                            }
                        }
                    };
                    ScrollbarPlugin.prototype.trackKbListenerClick = function (e) {
                        var t = e.target;
                        while (t != null) {
                            if (t === this._kbListener) {
                                this._kbActive = true;
                                return;
                            }
                            t = t.parentElement;
                        }
                        this._kbActive = false;
                    };
                    ScrollbarPlugin.prototype.isKbListenerHidden = function () {
                        return this._kbListener.offsetParent == null;
                    };
                    ScrollbarPlugin.prototype.enableKb = function () { this._kbActive = true; };
                    ScrollbarPlugin.prototype.disableKb = function () { this._kbActive = false; };
                    ScrollbarPlugin.prototype.keydownHook = function (e) {
                        if (e.target && e.target['nodeName']) {
                            if (ScrollbarPlugin._forbiddenNodes.indexOf(e.target.nodeName) > -1) {
                                return true;
                            }
                        }
                        if (!this._kbActive) {
                            return true;
                        }
                        if (this.isKbListenerHidden()) {
                            return true;
                        }
                        if (this._isHidden) {
                            return true;
                        }
                        if (this.handleKey(e.keyCode)) {
                            e.preventDefault();
                            e.stopPropagation();
                            return false;
                        }
                        else {
                            return true;
                        }
                    };
                    ScrollbarPlugin.prototype.handleKey = function (keyCode) {
                        var result = false;
                        var mappings = this.Configuration.Keys;
                        if (mappings.SingleDown.indexOf(keyCode) > -1) {
                            this.deferScroll(this.MasterTable.Partition.FloatingSkip + this.Configuration.Forces.SingleForce);
                            result = true;
                        }
                        if (mappings.SingleUp.indexOf(keyCode) > -1) {
                            this.deferScroll(this.MasterTable.Partition.FloatingSkip - this.Configuration.Forces.SingleForce);
                            result = true;
                        }
                        if (mappings.PageDown.indexOf(keyCode) > -1) {
                            this.deferScroll(this.MasterTable.Partition.FloatingSkip + (this.Configuration.UseTakeAsPageForce ? this.MasterTable.Partition.Take : this.Configuration.Forces.PageForce));
                            result = true;
                        }
                        if (mappings.PageUp.indexOf(keyCode) > -1) {
                            this.deferScroll(this.MasterTable.Partition.FloatingSkip - (this.Configuration.UseTakeAsPageForce ? this.MasterTable.Partition.Take : this.Configuration.Forces.PageForce));
                            result = true;
                        }
                        if (mappings.Home.indexOf(keyCode) > -1) {
                            this.deferScroll(0);
                            result = true;
                        }
                        if (mappings.End.indexOf(keyCode) > -1) {
                            this.deferScroll(this.MasterTable.Partition.amount() - this.MasterTable.Partition.Take);
                            result = true;
                        }
                        return result;
                    };
                    ScrollbarPlugin.prototype.activeAreaClick = function (e) {
                        if (e.target !== this.ScrollerActiveArea)
                            return;
                        var scrollerPos = this.Scroller.getBoundingClientRect();
                        var cs = this.Configuration.IsHorizontal ? scrollerPos.left : scrollerPos.top;
                        var pos = this.Configuration.IsHorizontal ? e.clientX : e.clientY;
                        var rowsPerPixel = this.MasterTable.Partition.amount() / this._availableSpace;
                        var diff = (pos - (cs + (this._scrollerSize / 2))) * rowsPerPixel;
                        this.MasterTable.Partition.setSkip(this.MasterTable.Partition.FloatingSkip + diff);
                        e.stopPropagation();
                    };
                    ScrollbarPlugin.prototype.activeAreaMouseDown = function (e) {
                        this.activeAreaClick(e);
                        this.scrollerStart(e);
                    };
                    ScrollbarPlugin.prototype.scrollerStart = function (e) {
                        this._mouseStartPos = this.Configuration.IsHorizontal ? e.clientX : e.clientY;
                        this._startSkip = this.MasterTable.Partition.FloatingSkip;
                        this._skipOnUp = -1;
                        Reinforced.Lattice.Services.EventsDelegatorService.addHandler(document.body, 'mousemove', this._boundScrollerMove);
                        Reinforced.Lattice.Services.EventsDelegatorService.addHandler(document.body, 'mouseup', this._boundScrollerEnd);
                        this.startDeferring();
                    };
                    ScrollbarPlugin.prototype.scrollerMove = function (e) {
                        if (e.buttons === 0) {
                            this.scrollerEnd(e);
                        }
                        var cPos = this.Configuration.IsHorizontal ? e.clientX : e.clientY;
                        var amt = this.MasterTable.Partition.amount();
                        var rowsPerPixel = amt / this._availableSpace;
                        var diff = (cPos - this._mouseStartPos) * rowsPerPixel;
                        var skp = this._startSkip + diff;
                        if (skp < 0)
                            skp = 0;
                        if (skp > amt - this.MasterTable.Partition.Take)
                            skp = amt - this.MasterTable.Partition.Take;
                        if (this.MasterTable.Partition.isServer()) {
                            if (this.MasterTable.Partition.hasEnoughDataToSkip(skp)) {
                                this.deferScroll(skp);
                                this._skipOnUp = -1;
                            }
                            else {
                                this._skipOnUp = skp;
                                this.adjustScrollerPosition(skp);
                            }
                        }
                        else {
                            this.deferScroll(skp);
                        }
                        e.stopPropagation();
                        e.preventDefault();
                    };
                    ScrollbarPlugin.prototype.scrollerEnd = function (e) {
                        this.endDeferring();
                        Reinforced.Lattice.Services.EventsDelegatorService.removeHandler(document.body, 'mousemove', this._boundScrollerMove);
                        Reinforced.Lattice.Services.EventsDelegatorService.removeHandler(document.body, 'mouseup', this._boundScrollerEnd);
                        if (e != null) {
                            e.stopPropagation();
                            e.preventDefault();
                        }
                    };
                    ScrollbarPlugin.prototype.handleWheel = function (e) {
                        if (this._isHidden)
                            return;
                        var range = 0;
                        if (e.deltaMode === e.DOM_DELTA_PIXEL) {
                            range = (e.deltaY > 0 ? 1 : -1) * this.Configuration.Forces.WheelForce;
                        }
                        if (e.deltaMode === e.DOM_DELTA_LINE) {
                            range = e.deltaY * this.Configuration.Forces.WheelForce;
                        }
                        if (e.deltaMode === e.DOM_DELTA_PAGE) {
                            range = e.deltaY * (this.Configuration.UseTakeAsPageForce ? this.MasterTable.Partition.Take : this.Configuration.Forces.PageForce);
                        }
                        if (range !== 0 && (this.MasterTable.Partition.FloatingSkip + range >= 0)) {
                            this.MasterTable.Partition.setSkip(this.MasterTable.Partition.FloatingSkip + range);
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    };
                    ScrollbarPlugin.prototype.upArrowStart = function (e) {
                        this._upArrowActive = true;
                        this._upArrowInterval = setInterval(this.upArrow.bind(this), this.Configuration.ArrowsDelayMs);
                        e.stopPropagation();
                    };
                    ScrollbarPlugin.prototype.upArrow = function () {
                        if (this.MasterTable.Partition.FloatingSkip === 0)
                            return;
                        this.MasterTable.Partition.setSkip(this.MasterTable.Partition.FloatingSkip - this.Configuration.Forces.SingleForce);
                    };
                    ScrollbarPlugin.prototype.upArrowEnd = function (e) {
                        if (!this._upArrowActive)
                            return;
                        this._upArrowActive = false;
                        clearInterval(this._upArrowInterval);
                        e.stopPropagation();
                    };
                    ScrollbarPlugin.prototype.downArrowStart = function (e) {
                        this._downArrowActive = true;
                        this._downArrowInterval = setInterval(this.downArrow.bind(this), this.Configuration.ArrowsDelayMs);
                        e.stopPropagation();
                    };
                    ScrollbarPlugin.prototype.downArrow = function () {
                        if (this.MasterTable.Partition.Type !== Reinforced.Lattice.PartitionType.Sequential) {
                            if (this.MasterTable.Partition.FloatingSkip + this.MasterTable.Partition.Take >=
                                this.MasterTable.Partition.amount())
                                return;
                        }
                        this.MasterTable.Partition.setSkip(this.MasterTable.Partition.FloatingSkip + this.Configuration.Forces.SingleForce);
                    };
                    ScrollbarPlugin.prototype.downArrowEnd = function (e) {
                        if (!this._downArrowActive)
                            return;
                        this._downArrowActive = false;
                        clearInterval(this._downArrowInterval);
                        e.stopPropagation();
                    };
                    ScrollbarPlugin.prototype.startDeferring = function () {
                        this._moveCheckInterval = setInterval(this.moveCheck.bind(this), this.Configuration.ScrollDragSmoothness);
                    };
                    ScrollbarPlugin.prototype.deferScroll = function (skip) {
                        if (!this._moveCheckInterval)
                            this.MasterTable.Partition.setSkip(skip);
                        else
                            this._needMoveTo = skip;
                    };
                    ScrollbarPlugin.prototype.moveCheck = function () {
                        var nmt = this._needMoveTo;
                        if (nmt !== this._movedTo) {
                            this.MasterTable.Partition.setSkip(nmt);
                            this._movedTo = nmt;
                        }
                    };
                    ScrollbarPlugin.prototype.endDeferring = function () {
                        clearInterval(this._moveCheckInterval);
                        if (this.MasterTable.Partition.isServer()) {
                            if (this._skipOnUp !== -1)
                                this._needMoveTo = this._skipOnUp;
                        }
                        this.moveCheck();
                    };
                    ScrollbarPlugin.prototype.hideScroll = function (force) {
                        if (force === void 0) { force = false; }
                        this._isHiddenForcibly = force;
                        this._isHidden = true;
                        this._scollbar.style.visibility = 'hidden';
                    };
                    ScrollbarPlugin.prototype.showScroll = function (force) {
                        if (force === void 0) { force = false; }
                        if (this._isHiddenForcibly && !force)
                            return;
                        this._isHidden = false;
                        this._isHiddenForcibly = false;
                        this._scollbar.style.visibility = 'visible';
                        if (this._needUpdateCoords) {
                            this.updatePosition();
                        }
                    };
                    ScrollbarPlugin.prototype.onPartitionChange = function (e) {
                        if (!this.MasterTable.DataHolder.Ordered
                            || (this.MasterTable.Partition.isClient() && this.MasterTable.DataHolder.Ordered.length <= e.MasterTable.Partition.Take)
                            || this.MasterTable.DataHolder.DisplayedData.length === 0
                            || e.EventArgs.Take === 0) {
                            this.hideScroll(true);
                            return;
                        }
                        else {
                            this.showScroll(true);
                        }
                        if (this.MasterTable.Partition.amount() !== this._previousAmout) {
                            this.adjustScrollerHeight();
                        }
                        this.adjustScrollerPosition(e.EventArgs.FloatingSkip);
                    };
                    ScrollbarPlugin.prototype.onClientDataProcessing = function (e) {
                        if (e.EventArgs.OnlyPartitionPerformed)
                            return;
                        if (e.MasterTable.Partition.Take === 0
                            || (((this.MasterTable.Partition.Type === Reinforced.Lattice.PartitionType.Client) || (this.MasterTable.Partition.Type === Reinforced.Lattice.PartitionType.Sequential))
                                && e.EventArgs.Ordered.length <= e.MasterTable.Partition.Take)
                            || e.EventArgs.Displaying.length === 0) {
                            this.hideScroll(true);
                            return;
                        }
                        else {
                            this.showScroll(true);
                        }
                        this.adjustScrollerHeight();
                        this.adjustScrollerPosition(this.MasterTable.Partition.FloatingSkip);
                    };
                    ScrollbarPlugin.prototype.subscribe = function (e) {
                        e.LayoutRendered.subscribeAfter(this.onLayoutRendered.bind(this), 'scrollbar');
                        e.PartitionChanged.subscribeAfter(this.onPartitionChange.bind(this), 'scrollbar');
                        e.ClientDataProcessing.subscribeAfter(this.onClientDataProcessing.bind(this), 'scrollbar');
                    };
                    ScrollbarPlugin._forbiddenNodes = ['input', 'INPUT', 'textarea', 'TEXTAREA', 'select', 'SELECT', 'object', 'OBJECT', 'iframe', 'IFRAME'];
                    return ScrollbarPlugin;
                }(Reinforced.Lattice.Plugins.PluginBase));
                Scrollbar.ScrollbarPlugin = ScrollbarPlugin;
                Lattice.ComponentsContainer.registerComponent('Scrollbar', ScrollbarPlugin);
            })(Scrollbar = Plugins.Scrollbar || (Plugins.Scrollbar = {}));
        })(Plugins = Lattice.Plugins || (Lattice.Plugins = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Plugins;
        (function (Plugins) {
            var Toolbar;
            (function (Toolbar) {
                var ToolbarPlugin = (function (_super) {
                    __extends(ToolbarPlugin, _super);
                    function ToolbarPlugin() {
                        var _this = _super !== null && _super.apply(this, arguments) || this;
                        _this.AllButtons = {};
                        _this._buttonsConfig = {};
                        return _this;
                    }
                    ToolbarPlugin.prototype.buttonHandleEvent = function (e) {
                        var btnId = e.EventArguments[0];
                        this.handleButtonAction(this._buttonsConfig[btnId]);
                    };
                    ToolbarPlugin.prototype.redrawMe = function () {
                        this.MasterTable.Renderer.Modifier.redrawPlugin(this);
                    };
                    ToolbarPlugin.prototype.handleButtonAction = function (btn) {
                        var _this = this;
                        if (btn.OnClick) {
                            btn.OnClick.call(this.MasterTable, this.MasterTable, this.AllButtons[btn.InternalId]);
                        }
                        if (btn.Command) {
                            if (btn.BlackoutWhileCommand) {
                                btn.IsDisabled = true;
                                this.redrawMe();
                                this.MasterTable.Commands.triggerCommand(btn.Command, null, function (r) {
                                    btn.IsDisabled = false;
                                    _this.redrawMe();
                                });
                            }
                            else {
                                this.MasterTable.Commands.triggerCommand(btn.Command, null);
                            }
                        }
                    };
                    ToolbarPlugin.prototype.renderContent = function (p) {
                        this.defaultRender(p);
                    };
                    ToolbarPlugin.prototype.traverseButtons = function (arr) {
                        for (var i = 0; i < arr.length; i++) {
                            this._buttonsConfig[arr[i].InternalId] = arr[i];
                            if (arr[i].HasSubmenu) {
                                this.traverseButtons(arr[i].Submenu);
                            }
                        }
                    };
                    ToolbarPlugin.prototype.onSelectionChanged = function (e) {
                        var atleastOne = false;
                        var disabled = true;
                        for (var d in e.EventArgs) {
                            disabled = false;
                            break;
                        }
                        for (var bc in this._buttonsConfig) {
                            if (this._buttonsConfig.hasOwnProperty(bc)) {
                                if (this._buttonsConfig[bc].DisableIfNothingChecked) {
                                    if (this._buttonsConfig[bc].IsDisabled !== disabled) {
                                        atleastOne = true;
                                        this._buttonsConfig[bc].IsDisabled = disabled;
                                    }
                                }
                            }
                        }
                        if (atleastOne)
                            this.MasterTable.Renderer.Modifier.redrawPlugin(this);
                    };
                    ToolbarPlugin.prototype.init = function (masterTable) {
                        _super.prototype.init.call(this, masterTable);
                        var nothingSelected = this.MasterTable.Selection.getSelectedKeys().length === 0;
                        for (var i = 0; i < this.Configuration.Buttons.length; i++) {
                            if (this.Configuration.Buttons[i].DisableIfNothingChecked) {
                                this.Configuration.Buttons[i].IsDisabled = nothingSelected;
                            }
                        }
                        this.traverseButtons(this.Configuration.Buttons);
                        this.MasterTable.Events.SelectionChanged.subscribe(this.onSelectionChanged.bind(this), 'toolbar');
                    };
                    return ToolbarPlugin;
                }(Reinforced.Lattice.Plugins.PluginBase));
                Toolbar.ToolbarPlugin = ToolbarPlugin;
                Lattice.ComponentsContainer.registerComponent('Toolbar', ToolbarPlugin);
            })(Toolbar = Plugins.Toolbar || (Plugins.Toolbar = {}));
        })(Plugins = Lattice.Plugins || (Lattice.Plugins = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Plugins;
        (function (Plugins) {
            var Total;
            (function (Total) {
                var TotalsPlugin = (function (_super) {
                    __extends(TotalsPlugin, _super);
                    function TotalsPlugin() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    TotalsPlugin.prototype.makeTotalsRow = function () {
                        var cols = this.MasterTable.InstanceManager.getUiColumns();
                        var dataObject = {};
                        for (var j = 0; j < cols.length; j++) {
                            var v = null;
                            var cl = cols[j];
                            if (this._totalsForColumns.hasOwnProperty(cl.RawName)) {
                                v = this._totalsForColumns[cl.RawName];
                                if (this.Configuration.ColumnsValueFunctions[cl.RawName]) {
                                    v = this.Configuration.ColumnsValueFunctions[cl.RawName](v);
                                }
                            }
                            dataObject[cols[j].RawName] = v;
                        }
                        var result = {
                            Index: -1,
                            MasterTable: this.MasterTable,
                            DataObject: dataObject,
                            Cells: {},
                            renderContent: null,
                            renderElement: null,
                            IsSpecial: true,
                            Command: null,
                            DisplayIndex: -1,
                            IsLast: false
                        };
                        for (var i = 0; i < cols.length; i++) {
                            var col = cols[i];
                            var cell = {
                                DataObject: dataObject,
                                renderElement: null,
                                renderContent: function (v) { v.w(this.Data); },
                                Column: cols[i],
                                Row: result,
                                Data: dataObject[col.RawName]
                            };
                            result.Cells[col.RawName] = cell;
                        }
                        return result;
                    };
                    TotalsPlugin.prototype.onAdjustments = function (e) {
                        var adjustments = e.EventArgs;
                        if (adjustments.NeedRefilter)
                            return;
                        var row = this.makeTotalsRow();
                        this.MasterTable.Renderer.Modifier.redrawRow(row);
                    };
                    TotalsPlugin.prototype.onClientDataProcessed = function (e) {
                        if (!this._totalsForColumns)
                            this._totalsForColumns = {};
                        for (var k in this.Configuration.ColumnsCalculatorFunctions) {
                            if (this.Configuration.ColumnsCalculatorFunctions.hasOwnProperty(k)) {
                                this._totalsForColumns[k] = this.Configuration.ColumnsCalculatorFunctions[k](e.EventArgs);
                            }
                        }
                    };
                    TotalsPlugin.prototype.subscribe = function (e) {
                        e.ClientDataProcessing.subscribeAfter(this.onClientDataProcessed.bind(this), 'totals');
                        e.Adjustment.subscribeAfter(this.onAdjustments.bind(this), 'totals');
                        this.MasterTable.Controller.registerAdditionalRowsProvider(this);
                    };
                    TotalsPlugin.prototype.handleAdditionalData = function (additionalData) {
                        var total = additionalData;
                        for (var tc in total.TotalsForColumns) {
                            if (!this._totalsForColumns)
                                this._totalsForColumns = {};
                            this._totalsForColumns[tc] = total.TotalsForColumns[tc];
                        }
                    };
                    TotalsPlugin.prototype.init = function (masterTable) {
                        _super.prototype.init.call(this, masterTable);
                        this.MasterTable.Loader.registerAdditionalDataReceiver('Total', this);
                    };
                    TotalsPlugin.prototype.provide = function (rows) {
                        if (this._totalsForColumns) {
                            if (this.Configuration.ShowOnTop) {
                                rows.splice(0, 0, this.makeTotalsRow());
                            }
                            else {
                                rows.push(this.makeTotalsRow());
                            }
                        }
                    };
                    return TotalsPlugin;
                }(Reinforced.Lattice.Plugins.PluginBase));
                Total.TotalsPlugin = TotalsPlugin;
                Lattice.ComponentsContainer.registerComponent('Total', TotalsPlugin);
            })(Total = Plugins.Total || (Plugins.Total = {}));
        })(Plugins = Lattice.Plugins || (Lattice.Plugins = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Rendering;
        (function (Rendering) {
            var BackBinder = (function () {
                function BackBinder(dateService) {
                    this._dateService = dateService;
                }
                BackBinder.prototype.backBind = function (parentElement, info) {
                    this.backbindDatepickers(parentElement, info);
                    this.backbindMark(parentElement, info);
                    this.backbindEvents(parentElement, info);
                    this.backbindVisualStates(parentElement, info);
                    this.backbindCallbacks(parentElement, info);
                };
                BackBinder.prototype.traverseBackbind = function (elements, parentElement, backbindCollection, attribute, fn) {
                    for (var i = 0; i < elements.length; i++) {
                        var element = elements[i];
                        var attr = null;
                        var attrNamesToRemove = [];
                        for (var j = 0; j < element.attributes.length; j++) {
                            if (element.attributes.item(j).name.substring(0, attribute.length) === attribute) {
                                attr = element.attributes.item(j);
                                var idx = parseInt(attr.value);
                                var backbindDescription = backbindCollection[idx];
                                fn.call(this, backbindDescription, element);
                                attrNamesToRemove.push(attr.name);
                            }
                        }
                        for (var k = 0; k < attrNamesToRemove.length; k++) {
                            element.removeAttribute(attrNamesToRemove[k]);
                        }
                    }
                };
                BackBinder.prototype.getMatchingElements = function (parent, attr) {
                    if (parent == null)
                        return [];
                    var list = parent.querySelectorAll("[" + attr + "]");
                    var result = [];
                    for (var i = 0; i < list.length; i++) {
                        result.push(list.item(i));
                    }
                    if (parent.hasAttribute(attr))
                        result.push(parent);
                    return result;
                };
                BackBinder.prototype.backbindDatepickers = function (parentElement, info) {
                    var _this = this;
                    var elements = this.getMatchingElements(parentElement, 'data-dp');
                    this.traverseBackbind(elements, parentElement, info.DatepickersQueue, 'data-dp', function (b, e) {
                        _this._dateService.createDatePicker(e, b.IsNullable);
                        _this.Delegator.subscribeDestroy(e, {
                            Callback: _this._dateService.destroyDatePicker,
                            CallbackArguments: [],
                            Target: _this._dateService
                        });
                    });
                };
                BackBinder.prototype.backbindMark = function (parentElement, info) {
                    var elements = this.getMatchingElements(parentElement, 'data-mrk');
                    this.traverseBackbind(elements, parentElement, info.MarkQueue, 'data-mrk', function (b, e) {
                        var target = b.ElementReceiver;
                        if (Object.prototype.toString.call(b.ElementReceiver[b.FieldName]) === '[object Array]') {
                            target[b.FieldName].push(e);
                        }
                        else if (b.Key != null && b.Key != undefined) {
                            if (typeof b.ElementReceiver[b.FieldName] === 'object') {
                                target[b.FieldName][b.Key] = e;
                            }
                        }
                        else {
                            target[b.FieldName] = e;
                        }
                    });
                };
                BackBinder.prototype.backbindCallbacks = function (parentElement, info) {
                    var _this = this;
                    var elements = this.getMatchingElements(parentElement, "data-cb");
                    this.traverseBackbind(elements, parentElement, info.CallbacksQueue, 'data-cb', function (b, e) {
                        var t = _this.evalCallback(b.Callback);
                        (t.fn).apply(t.target, [e].concat(b.CallbackArguments));
                    });
                    elements = this.getMatchingElements(parentElement, "data-dcb");
                    this.traverseBackbind(elements, parentElement, info.DestroyCallbacksQueue, 'data-dcb', function (b, e) {
                        var tp = _this.evalCallback(b.Callback);
                        _this.Delegator.subscribeDestroy(e, {
                            CallbackArguments: b.CallbackArguments,
                            Target: tp.target,
                            Callback: tp.fn
                        });
                    });
                };
                BackBinder.prototype.backbindEvents = function (parentElement, info) {
                    var _this = this;
                    var elements = this.getMatchingElements(parentElement, "data-evb");
                    this.traverseBackbind(elements, parentElement, info.EventsQueue, 'data-be', function (subscription, element) {
                        for (var j = 0; j < subscription.Functions.length; j++) {
                            var bindFn = subscription.Functions[j];
                            var handler = null;
                            var target = subscription.EventReceiver;
                            if (target[bindFn] && (typeof target[bindFn] === 'function'))
                                handler = subscription.EventReceiver[bindFn];
                            else {
                                var traverse = _this.evalCallback(bindFn);
                                target = traverse.target;
                                handler = traverse.fn;
                            }
                            if (subscription.Event.Out) {
                                _this.Delegator.subscribeOutOfElementEvent(element, subscription.Event, handler, target, subscription.EventArguments);
                            }
                            else {
                                _this.Delegator.subscribeEvent(element, subscription.Event, handler, target, subscription.EventArguments);
                            }
                        }
                    });
                };
                BackBinder.prototype.evalCallback = function (calbackString) {
                    if (typeof calbackString === "function")
                        return { fn: calbackString, target: window };
                    if (calbackString.trim().substr(0, 'function'.length) === 'function') {
                        var cb = null;
                        eval("cb = (" + calbackString + ");");
                        return { fn: cb, target: window };
                    }
                    var tp = BackBinder.traverseWindowPath(calbackString);
                    if (typeof tp.target !== "function")
                        throw new Error(calbackString + " supplied for rendering callback is not a function");
                    return { fn: tp.target, target: tp.parent };
                };
                BackBinder.traverseWindowPath = function (path) {
                    if (path.indexOf('.') > -1) {
                        var pth = path.split('.');
                        var parent = window;
                        var target = window;
                        for (var i = 0; i < pth.length; i++) {
                            parent = target;
                            target = parent[pth[i]];
                        }
                        return { target: target, parent: parent };
                    }
                    else {
                        return { target: window[path], parent: window };
                    }
                };
                BackBinder.prototype.backbindVisualStates = function (parentElement, info) {
                    if (info.HasVisualStates) {
                        var targetPendingNormal = [];
                        for (var vsk in info.CachedVisualStates) {
                            if (info.CachedVisualStates.hasOwnProperty(vsk)) {
                                var state = info.CachedVisualStates[vsk];
                                var elements = this.getMatchingElements(parentElement, "data-state-" + vsk);
                                for (var i = 0; i < elements.length; i++) {
                                    var element = elements[i];
                                    state[i].Element = element;
                                    element.removeAttribute("data-state-" + vsk);
                                    var target = state[i].Receiver;
                                    if (targetPendingNormal.indexOf(target) < 0) {
                                        targetPendingNormal.push(target);
                                        target.VisualStates = new Rendering.VisualState();
                                    }
                                    if (!target.VisualStates)
                                        target.VisualStates = new Rendering.VisualState();
                                    if (!target.VisualStates.States.hasOwnProperty(vsk))
                                        target.VisualStates.States[vsk] = [];
                                    target.VisualStates.States[vsk].push(state[i]);
                                }
                            }
                        }
                        info.HasVisualStates = false;
                        this.resolveNormalStates(targetPendingNormal);
                        info.CachedVisualStates = {};
                    }
                };
                BackBinder.prototype.resolveNormalStates = function (targets) {
                    for (var i = 0; i < targets.length; i++) {
                        this.addNormalState(targets[i].VisualStates.States, targets[i]);
                    }
                };
                BackBinder.prototype.addNormalState = function (states, target) {
                    var normalState = [];
                    var trackedElements = [];
                    for (var sk in states) {
                        if (states.hasOwnProperty(sk)) {
                            for (var i = 0; i < states[sk].length; i++) {
                                var stateIdx = trackedElements.indexOf(states[sk][i].Element);
                                if (stateIdx < 0) {
                                    stateIdx = normalState.length;
                                    trackedElements.push(states[sk][i].Element);
                                    var newEntry = {
                                        Element: states[sk][i].Element,
                                        attrs: {},
                                        classes: [],
                                        styles: {},
                                        id: 'normal',
                                        Receiver: target,
                                        content: (states[sk][i].content != null && states[sk][i].content.length > 0) ? states[sk][i].Element.innerHTML : null
                                    };
                                    normalState.push(newEntry);
                                    if (Reinforced.Lattice.IeCheck.isIeGreater(9)) {
                                        for (var j = 0; j < newEntry.Element.classList.length; j++) {
                                            newEntry.classes.push(newEntry.Element.classList.item(j));
                                        }
                                    }
                                    else {
                                        if (newEntry.Element.className.length > 0) {
                                            var classes = newEntry.Element.className.split(' ');
                                            for (var j = 0; j < classes.length; j++) {
                                                newEntry.classes.push(classes[j]);
                                            }
                                        }
                                    }
                                }
                                this.mixinToNormal(normalState[stateIdx], states[sk][i]);
                            }
                        }
                    }
                    states['_normal'] = normalState;
                };
                BackBinder.prototype.mixinToNormal = function (normal, custom) {
                    if (custom.attrs) {
                        for (var attrKey in custom.attrs) {
                            if (custom.attrs.hasOwnProperty(attrKey)) {
                                if (!normal.attrs.hasOwnProperty(attrKey)) {
                                    normal.attrs[attrKey] = (!normal.Element.hasAttribute(attrKey)) ?
                                        null : normal.Element.getAttribute(attrKey);
                                }
                            }
                        }
                    }
                    if (custom.styles) {
                        for (var styleKey in custom.styles) {
                            if (custom.styles.hasOwnProperty(styleKey)) {
                                if (!normal.styles.hasOwnProperty(styleKey)) {
                                    normal.styles[styleKey] = normal.Element.style.getPropertyValue(styleKey);
                                }
                            }
                        }
                    }
                };
                return BackBinder;
            }());
            Rendering.BackBinder = BackBinder;
        })(Rendering = Lattice.Rendering || (Lattice.Rendering = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Rendering;
        (function (Rendering) {
            var DOMLocator = (function () {
                function DOMLocator(bodyElement, rootElement, rootId) {
                    this._bodyElement = bodyElement;
                    this._rootElement = rootElement;
                    this._rootIdPrefix = "#" + rootId;
                }
                DOMLocator.prototype.getCellElement = function (cell) {
                    var track = Lattice.TrackHelper.getCellTrack(cell);
                    return this._bodyElement.querySelector("[data-track=\"" + track + "\"]");
                };
                DOMLocator.prototype.getCellElementByIndex = function (rowDisplayIndex, columnIndex) {
                    var track = Lattice.TrackHelper.getCellTrackByIndexes(rowDisplayIndex, columnIndex);
                    return this._bodyElement.querySelector("[data-track=\"" + track + "\"]");
                };
                DOMLocator.prototype.getRowElement = function (row) {
                    var track = Lattice.TrackHelper.getRowTrack(row);
                    return this._bodyElement.querySelector("[data-track=\"" + track + "\"]");
                };
                DOMLocator.prototype.getRowElementByObject = function (dataObject) {
                    var track = Lattice.TrackHelper.getRowTrackByObject(dataObject);
                    return this._bodyElement.querySelector("[data-track=\"" + track + "\"]");
                };
                DOMLocator.prototype.getPartitionRowElement = function () {
                    var track = Lattice.TrackHelper.getPartitionRowTrack();
                    return this._bodyElement.querySelector("[data-track=\"" + track + "\"]");
                };
                DOMLocator.prototype.getRowElements = function () {
                    return this._bodyElement.querySelectorAll("[data-track^=\"r-\"]");
                };
                DOMLocator.prototype.getLineElements = function () {
                    return this._bodyElement.querySelectorAll("[data-track^=\"ln-\"]");
                };
                DOMLocator.prototype.getRowElementByIndex = function (rowDisplayingIndex) {
                    var track = Lattice.TrackHelper.getRowTrackByIndex(rowDisplayingIndex);
                    return this._bodyElement.querySelector("[data-track=\"" + track + "\"]");
                };
                DOMLocator.prototype.getLineElementByIndex = function (lineDisplayingIndex) {
                    var track = Lattice.TrackHelper.getLineTrackByIndex(lineDisplayingIndex);
                    return this._bodyElement.querySelector("[data-track=\"" + track + "\"]");
                };
                DOMLocator.prototype.getColumnCellsElements = function (column) {
                    var colIdx = column.Order;
                    return this._bodyElement.querySelectorAll("[data-track$=\"-c" + colIdx + "\"]");
                };
                DOMLocator.prototype.getColumnCellsElementsByColumnIndex = function (columnIndex) {
                    return this._bodyElement.querySelectorAll("[data-track$=\"-c" + columnIndex + "\"]");
                };
                DOMLocator.prototype.getRowCellsElements = function (row) {
                    return this.getRowCellsElementsByIndex(row.Index);
                };
                DOMLocator.prototype.getRowCellsElementsByIndex = function (rowDisplayingIndex) {
                    return this._bodyElement.querySelectorAll("[data-track^=\"c-r" + rowDisplayingIndex + "-\"]");
                };
                DOMLocator.prototype.getHeaderElement = function (header) {
                    var track = Lattice.TrackHelper.getHeaderTrack(header);
                    return this._rootElement.querySelector("[data-track=\"" + track + "\"]");
                };
                DOMLocator.prototype.getPluginElement = function (plugin) {
                    var track = Lattice.TrackHelper.getPluginTrack(plugin);
                    return this._rootElement.querySelector("[data-track=\"" + track + "\"]");
                };
                DOMLocator.prototype.getPluginElementsByPositionPart = function (placement) {
                    var track = Lattice.TrackHelper.getPluginTrackByLocation(placement);
                    return this._rootElement.querySelectorAll("[data-track^=\"" + track + "\"]");
                };
                DOMLocator.prototype.isRow = function (e) {
                    if (!e)
                        return false;
                    if (!e.getAttribute)
                        return false;
                    var trk = e.getAttribute('data-track');
                    if (!trk)
                        return false;
                    return (trk.charAt(0) === 'r') && (trk.charAt(1) === '-');
                };
                DOMLocator.prototype.isSpecialRow = function (e) {
                    if (!e)
                        return false;
                    if (!e.getAttribute)
                        return false;
                    var spr = e.getAttribute('data-spr');
                    if (!spr)
                        return false;
                    return true;
                };
                DOMLocator.prototype.isCell = function (e) {
                    if (!e)
                        return false;
                    if (!e.getAttribute)
                        return false;
                    var trk = e.getAttribute('data-track');
                    if (!trk)
                        return false;
                    return (trk.charAt(0) === 'c')
                        && (trk.charAt(1) === '-')
                        && (trk.charAt(2) === 'r');
                };
                return DOMLocator;
            }());
            Rendering.DOMLocator = DOMLocator;
        })(Rendering = Lattice.Rendering || (Lattice.Rendering = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Rendering;
        (function (Rendering) {
            var DOMModifier = (function () {
                function DOMModifier(executor, locator, backBinder, instances, ed, bodyElement) {
                    this.displayCache = {};
                    this._locator = locator;
                    this._backBinder = backBinder;
                    this._instances = instances;
                    this._ed = ed;
                    this._tpl = executor;
                    this._bodyElement = bodyElement;
                }
                DOMModifier.prototype.destroyPartitionRow = function () {
                    var rowElement = this._locator.getPartitionRowElement();
                    if (!rowElement)
                        return;
                    this.destroyElement(rowElement);
                };
                DOMModifier.prototype.getRealDisplay = function (elem) {
                    if (elem.currentStyle)
                        return elem.currentStyle.display;
                    else if (window.getComputedStyle) {
                        var computedStyle = window.getComputedStyle(elem, null);
                        return computedStyle.getPropertyValue('display');
                    }
                    return '';
                };
                DOMModifier.prototype.hideElement = function (el) {
                    var e = el;
                    if (!el)
                        return;
                    if (!el.getAttribute('displayOld'))
                        el.setAttribute("displayOld", e.style.display);
                    e.style.display = "none";
                };
                DOMModifier.prototype.showElement = function (el) {
                    var e = el;
                    if (!el)
                        return;
                    if (this.getRealDisplay(el) !== 'none')
                        return;
                    var old = el.getAttribute("displayOld");
                    e.style.display = old || "";
                    if (this.getRealDisplay(el) === "none") {
                        var nodeName = el.nodeName, body = document.body, display;
                        if (this.displayCache[nodeName])
                            display = this.displayCache[nodeName];
                        else {
                            var testElem = document.createElement(nodeName);
                            body.appendChild(testElem);
                            display = this.getRealDisplay(testElem);
                            if (display === "none")
                                display = "block";
                            body.removeChild(testElem);
                            this.displayCache[nodeName] = display;
                        }
                        el.setAttribute('displayOld', display);
                        e.style.display = display;
                    }
                };
                DOMModifier.prototype.cleanSelector = function (targetSelector) {
                    var parent = document.querySelector(targetSelector);
                    this.cleanElement(parent);
                };
                DOMModifier.prototype.cleanElement = function (parent) {
                    for (var i = 0; i < parent.children.length; i++) {
                        this._ed.handleElementDestroy(parent.children.item(i));
                    }
                    parent.innerHTML = '';
                };
                DOMModifier.prototype.destroyElement = function (element) {
                    element.parentElement.removeChild(element);
                    this._ed.handleElementDestroy(element);
                };
                DOMModifier.prototype.destroyElements = function (elements) {
                    for (var i = 0; i < elements.length; i++) {
                        this.destroyElement(elements.item(i));
                    }
                };
                DOMModifier.prototype.hideElements = function (element) {
                    if (!element)
                        return;
                    for (var i = 0; i < element.length; i++) {
                        this.hideElement(element.item(i));
                    }
                };
                DOMModifier.prototype.showElements = function (element) {
                    if (!element)
                        return;
                    for (var i = 0; i < element.length; i++) {
                        this.showElement(element.item(i));
                    }
                };
                DOMModifier.prototype.redrawPlugin = function (plugin) {
                    var oldPluginElement = this._locator.getPluginElement(plugin);
                    var t = this._tpl.beginProcess();
                    Reinforced.Lattice.Templating.Driver.renderPlugin(t, plugin);
                    var result = this._tpl.endProcess(t);
                    var newPluginElement = this.replaceElement(oldPluginElement, result.Html);
                    this._backBinder.backBind(newPluginElement, result.BackbindInfo);
                    return newPluginElement;
                };
                DOMModifier.prototype.renderPlugin = function (plugin) {
                    var t = this._tpl.beginProcess();
                    Reinforced.Lattice.Templating.Driver.renderPlugin(t, plugin);
                    var result = this._tpl.endProcess(t);
                    return this.createElement(result.Html);
                };
                DOMModifier.prototype.redrawPluginsByPosition = function (position) {
                    var plugins = this._instances.getPlugins(position);
                    for (var i = 0; i < plugins.length; i++) {
                        this.redrawPlugin(plugins[i]);
                    }
                };
                DOMModifier.prototype.hidePlugin = function (plugin) {
                    var pluginElement = this._locator.getPluginElement(plugin);
                    this.hideElement(pluginElement);
                };
                DOMModifier.prototype.showPlugin = function (plugin) {
                    var pluginElement = this._locator.getPluginElement(plugin);
                    this.showElement(pluginElement);
                };
                DOMModifier.prototype.destroyPlugin = function (plugin) {
                    var pluginElement = this._locator.getPluginElement(plugin);
                    this.destroyElement(pluginElement);
                };
                DOMModifier.prototype.hidePluginsByPosition = function (position) {
                    var plugins = this._instances.getPlugins(position);
                    for (var i = 0; i < plugins.length; i++) {
                        this.hidePlugin(plugins[i]);
                    }
                };
                DOMModifier.prototype.showPluginsByPosition = function (position) {
                    var plugins = this._instances.getPlugins(position);
                    for (var i = 0; i < plugins.length; i++) {
                        this.showPlugin(plugins[i]);
                    }
                };
                DOMModifier.prototype.destroyPluginsByPosition = function (position) {
                    var plugins = this._instances.getPlugins(position);
                    for (var i = 0; i < plugins.length; i++) {
                        this.destroyPlugin(plugins[i]);
                    }
                };
                DOMModifier.prototype.redrawRow = function (row) {
                    var p = this._tpl.beginProcess();
                    Reinforced.Lattice.Templating.Driver.row(p, row);
                    var result = this._tpl.endProcess(p);
                    var oldElement = this._locator.getRowElement(row);
                    var newElem = this.replaceElement(oldElement, result.Html);
                    this._backBinder.backBind(newElem, result.BackbindInfo);
                    return newElem;
                };
                DOMModifier.prototype.destroyRowByObject = function (dataObject) {
                    var rowElement = this._locator.getRowElementByObject(dataObject);
                    if (!rowElement)
                        return;
                    this.destroyElement(rowElement);
                };
                DOMModifier.prototype.destroyRow = function (row) {
                    var rowElement = this._locator.getRowElement(row);
                    if (!rowElement)
                        return;
                    this.destroyElement(rowElement);
                };
                DOMModifier.prototype.hideRow = function (row) {
                    var rowElement = this._locator.getRowElement(row);
                    if (!rowElement)
                        return;
                    this.hideElement(rowElement);
                };
                DOMModifier.prototype.showRow = function (row) {
                    var rowElement = this._locator.getRowElement(row);
                    if (!rowElement)
                        return;
                    this.showElement(rowElement);
                };
                DOMModifier.prototype.appendRow = function (row, beforeRowAtIndex) {
                    var p = this._tpl.beginProcess();
                    Reinforced.Lattice.Templating.Driver.row(p, row);
                    var result = this._tpl.endProcess(p);
                    var newRowElement = this.createElement(result.Html);
                    if (beforeRowAtIndex != null && beforeRowAtIndex != undefined) {
                        var referenceNode = this._locator.getRowElementByIndex(beforeRowAtIndex);
                        referenceNode.parentNode.insertBefore(newRowElement, referenceNode);
                    }
                    else {
                        if (this._locator.isSpecialRow(this._bodyElement.lastElementChild)) {
                            var refNode = null;
                            var idx = this._bodyElement.childElementCount;
                            do {
                                idx--;
                                refNode = this._bodyElement.children.item(idx);
                            } while (this._locator.isSpecialRow(refNode));
                            refNode.parentNode.insertBefore(newRowElement, refNode);
                        }
                        this._bodyElement.appendChild(newRowElement);
                    }
                    this._backBinder.backBind(newRowElement, result.BackbindInfo);
                    return newRowElement;
                };
                DOMModifier.prototype.appendLine = function (line, beforeLineAtIndex) {
                    var p = this._tpl.beginProcess();
                    Reinforced.Lattice.Templating.Driver.line(p, line);
                    var result = this._tpl.endProcess(p);
                    var newLineElement = this.createElement(result.Html);
                    if (beforeLineAtIndex != null && beforeLineAtIndex != undefined) {
                        var referenceNode = this._locator.getLineElementByIndex(beforeLineAtIndex);
                        referenceNode.parentNode.insertBefore(newLineElement, referenceNode);
                    }
                    else {
                        this._bodyElement.appendChild(newLineElement);
                    }
                    this._backBinder.backBind(newLineElement, result.BackbindInfo);
                    return newLineElement;
                };
                DOMModifier.prototype.prependLine = function (line) {
                    var p = this._tpl.beginProcess();
                    Reinforced.Lattice.Templating.Driver.line(p, line);
                    var result = this._tpl.endProcess(p);
                    var newLineElement = this.createElement(result.Html);
                    if (this._bodyElement.childElementCount === 0) {
                        this._bodyElement.appendChild(newLineElement);
                    }
                    else {
                        var referenceNode = this._bodyElement.firstElementChild;
                        referenceNode.parentNode.insertBefore(newLineElement, referenceNode);
                    }
                    this._backBinder.backBind(newLineElement, result.BackbindInfo);
                    return newLineElement;
                };
                DOMModifier.prototype.prependRow = function (row) {
                    var p = this._tpl.beginProcess();
                    Reinforced.Lattice.Templating.Driver.row(p, row);
                    var result = this._tpl.endProcess(p);
                    var newRowElement = this.createElement(result.Html);
                    if (this._bodyElement.childElementCount === 0) {
                        this._bodyElement.appendChild(newRowElement);
                    }
                    else {
                        var referenceNode = this._bodyElement.firstElementChild;
                        if (this._locator.isSpecialRow(referenceNode)) {
                            var idx = 0;
                            do {
                                idx++;
                                referenceNode = this._bodyElement.children.item(idx);
                            } while (this._locator.isSpecialRow(referenceNode) || idx < this._bodyElement.childElementCount);
                            if (idx === this._bodyElement.childElementCount) {
                                this._bodyElement.appendChild(newRowElement);
                            }
                            else {
                                referenceNode.parentNode.insertBefore(newRowElement, referenceNode);
                            }
                        }
                        else {
                            referenceNode.parentNode.insertBefore(newRowElement, referenceNode);
                        }
                    }
                    this._backBinder.backBind(newRowElement, result.BackbindInfo);
                    return newRowElement;
                };
                DOMModifier.prototype.destroyRowByIndex = function (rowDisplayIndex) {
                    var rowElement = this._locator.getRowElementByIndex(rowDisplayIndex);
                    if (!rowElement)
                        return;
                    this.destroyElement(rowElement);
                };
                DOMModifier.prototype.destroyLineByIndex = function (lineDisplayIndex) {
                    var lineElement = this._locator.getLineElementByIndex(lineDisplayIndex);
                    if (!lineElement)
                        return;
                    this.destroyElement(lineElement);
                };
                DOMModifier.prototype.destroyRowByNumber = function (rowNumber) {
                    var rows = this._locator.getRowElements();
                    if (rowNumber > rows.length)
                        return;
                    this.destroyElement(rows.item(rowNumber));
                };
                DOMModifier.prototype.hideRowByIndex = function (rowDisplayIndex) {
                    var rowElement = this._locator.getRowElementByIndex(rowDisplayIndex);
                    if (!rowElement)
                        return;
                    this.hideElement(rowElement);
                };
                DOMModifier.prototype.showRowByIndex = function (rowDisplayIndex) {
                    var rowElement = this._locator.getRowElementByIndex(rowDisplayIndex);
                    if (!rowElement)
                        return;
                    this.showElement(rowElement);
                };
                DOMModifier.prototype.redrawCell = function (cell) {
                    var p = this._tpl.beginProcess();
                    Reinforced.Lattice.Templating.Driver.cell(p, cell);
                    var result = this._tpl.endProcess(p);
                    var oldElement = this._locator.getCellElement(cell);
                    var newElem = this.replaceElement(oldElement, result.Html);
                    this._backBinder.backBind(newElem, result.BackbindInfo);
                    return newElem;
                };
                DOMModifier.prototype.destroyCell = function (cell) {
                    var e = this._locator.getCellElement(cell);
                    if (!e)
                        return;
                    e.parentElement.removeChild(e);
                };
                DOMModifier.prototype.hideCell = function (cell) {
                    var e = this._locator.getCellElement(cell);
                    if (!e)
                        return;
                    this.hideElement(e);
                };
                DOMModifier.prototype.showCell = function (cell) {
                    var e = this._locator.getCellElement(cell);
                    if (!e)
                        return;
                    this.hideElement(e);
                };
                DOMModifier.prototype.destroyCellsByColumn = function (column) {
                    var e = this._locator.getColumnCellsElements(column);
                    this.destroyElements(e);
                };
                DOMModifier.prototype.hideCellsByColumn = function (column) {
                    var e = this._locator.getColumnCellsElements(column);
                    this.hideElements(e);
                };
                DOMModifier.prototype.showCellsByColumn = function (column) {
                    var e = this._locator.getColumnCellsElements(column);
                    this.showElements(e);
                };
                DOMModifier.prototype.destroyColumnCellsElementsByColumnIndex = function (columnIndex) {
                    var e = this._locator.getColumnCellsElementsByColumnIndex(columnIndex);
                    this.destroyElements(e);
                };
                DOMModifier.prototype.hideColumnCellsElementsByColumnIndex = function (columnIndex) {
                    var e = this._locator.getColumnCellsElementsByColumnIndex(columnIndex);
                    this.hideElements(e);
                };
                DOMModifier.prototype.showColumnCellsElementsByColumnIndex = function (columnIndex) {
                    var e = this._locator.getColumnCellsElementsByColumnIndex(columnIndex);
                    this.showElements(e);
                };
                DOMModifier.prototype.redrawHeader = function (column) {
                    var p = this._tpl.beginProcess();
                    Reinforced.Lattice.Templating.Driver.header(p, column);
                    var result = this._tpl.endProcess(p);
                    var oldHeaderElement = this._locator.getHeaderElement(column.Header);
                    var newElement = this.replaceElement(oldHeaderElement, result.Html);
                    this._backBinder.backBind(newElement, result.BackbindInfo);
                    return newElement;
                };
                DOMModifier.prototype.destroyHeader = function (column) {
                    var e = this._locator.getHeaderElement(column.Header);
                    if (!e)
                        return;
                    this.destroyElement(e);
                };
                DOMModifier.prototype.hideHeader = function (column) {
                    var e = this._locator.getHeaderElement(column.Header);
                    if (!e)
                        return;
                    this.hideElement(e);
                };
                DOMModifier.prototype.showHeader = function (column) {
                    var e = this._locator.getHeaderElement(column.Header);
                    if (!e)
                        return;
                    this.showElement(e);
                };
                DOMModifier.prototype.createElement = function (html) {
                    var parser = new Rendering.Html2Dom.HtmlParser();
                    return parser.html2Dom(html);
                };
                DOMModifier.prototype.createElementFromTemplate = function (templateId, viewModelBehind) {
                    var p = this._tpl.execute(viewModelBehind, templateId);
                    var parser = new Rendering.Html2Dom.HtmlParser();
                    var element = parser.html2Dom(p.Html);
                    this._backBinder.backBind(element, p.BackbindInfo);
                    return element;
                };
                DOMModifier.prototype.replaceElement = function (element, html) {
                    if (!element)
                        return null;
                    var node = this.createElement(html);
                    element.parentElement.replaceChild(node, element);
                    this._ed.handleElementDestroy(element);
                    return node;
                };
                return DOMModifier;
            }());
            Rendering.DOMModifier = DOMModifier;
        })(Rendering = Lattice.Rendering || (Lattice.Rendering = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Rendering;
        (function (Rendering) {
            var Html2Dom;
            (function (Html2Dom) {
                var HtmlParserDefinitions = (function () {
                    function HtmlParserDefinitions() {
                    }
                    HtmlParserDefinitions.makeMap = function (str) {
                        var obj = {}, items = str.split(',');
                        for (var i = 0; i < items.length; i++)
                            obj[items[i]] = true;
                        return obj;
                    };
                    HtmlParserDefinitions.startTag = /^<([-A-Za-z0-9_]+)((?:[\s\w\-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/;
                    HtmlParserDefinitions.endTag = /^<\/([-A-Za-z0-9_]+)[^>]*>/;
                    HtmlParserDefinitions.attr = /([-A-Za-z0-9_]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;
                    HtmlParserDefinitions.empty = HtmlParserDefinitions.makeMap('area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed');
                    HtmlParserDefinitions.block = HtmlParserDefinitions.makeMap('address,applet,blockquote,button,center,dd,del,dir,div,dl,dt,fieldset,form,frameset,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,p,pre,script,table,tbody,td,tfoot,th,thead,tr,ul,span');
                    HtmlParserDefinitions.inline = HtmlParserDefinitions.makeMap('a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,strike,strong,sub,sup,textarea,tt,u,var');
                    HtmlParserDefinitions.closeSelf = HtmlParserDefinitions.makeMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr');
                    HtmlParserDefinitions.fillAttrs = HtmlParserDefinitions.makeMap('checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected');
                    HtmlParserDefinitions.special = HtmlParserDefinitions.makeMap('script,style');
                    return HtmlParserDefinitions;
                }());
                Html2Dom.HtmlParserDefinitions = HtmlParserDefinitions;
                var HtmlParser = (function () {
                    function HtmlParser() {
                        this._elems = [];
                        this._topNodes = [];
                        this._stack = [];
                        this._stack.last = function () {
                            if (this.length === 0)
                                return null;
                            return this[this.length - 1];
                        };
                        this._parseStartBound = this.parseStartTag.bind(this);
                        this._parseEndBound = this.parseEndTag.bind(this);
                    }
                    HtmlParser.prototype.parse = function (html) {
                        var _this = this;
                        var index, chars, match, last = html;
                        while (html) {
                            chars = true;
                            var stackCurrent = this._stack.last();
                            if (!stackCurrent || !HtmlParserDefinitions.special[stackCurrent]) {
                                if (html.indexOf('<!--') === 0) {
                                    index = html.indexOf('-->');
                                    if (index >= 0) {
                                        html = html.substring(index + 3);
                                        chars = false;
                                    }
                                }
                                else if (html.indexOf('</') === 0) {
                                    match = html.match(HtmlParserDefinitions.endTag);
                                    if (match) {
                                        html = html.substring(match[0].length);
                                        match[0].replace(HtmlParserDefinitions.endTag, this._parseEndBound);
                                        chars = false;
                                    }
                                }
                                else if (html.indexOf('<') === 0) {
                                    match = html.match(HtmlParserDefinitions.startTag);
                                    if (match) {
                                        html = html.substring(match[0].length);
                                        match[0].replace(HtmlParserDefinitions.startTag, this._parseStartBound);
                                        chars = false;
                                    }
                                }
                                if (chars) {
                                    var pos = 0;
                                    var nxtchar;
                                    do {
                                        index = html.indexOf('<', pos);
                                        if (index >= 0 && index < html.length - 1) {
                                            nxtchar = html[index + 1];
                                            pos = index + 1;
                                        }
                                        else {
                                            break;
                                        }
                                    } while (!nxtchar.match(/[a-zA-Z\/]/));
                                    var text = index < 0 ? html : html.substring(0, index);
                                    html = index < 0 ? '' : html.substring(index);
                                    this.chars(text);
                                }
                            }
                            else {
                                if (stackCurrent === 'script') {
                                }
                                html = html.replace(new RegExp("([\\s\\S]*)</" + this._stack.last() + "[^>]*>", 'gm'), function (all, text) {
                                    text = text.replace(/<!--(.*?)-->/g, '$1')
                                        .replace(/<!\[CDATA\[(.*?)]]>/g, '$1');
                                    _this.chars(text);
                                    return '';
                                });
                                this.parseEndTag('', this._stack.last());
                            }
                            if (html === last)
                                throw new Error("HTML Parse Error: " + html);
                            last = html;
                        }
                        this.parseEndTag();
                    };
                    HtmlParser.prototype.parseStartTag = function (tag, tagName, rest, unary) {
                        tagName = tagName.toLowerCase();
                        if (HtmlParserDefinitions.closeSelf[tagName] && this._stack.last() === tagName) {
                            this.parseEndTag('', tagName);
                        }
                        unary = HtmlParserDefinitions.empty[tagName] || !!unary;
                        if (!unary)
                            this._stack.push(tagName);
                        var attrs = [];
                        rest.replace(HtmlParserDefinitions.attr, function (match, name) {
                            var value = arguments[2] ? arguments[2] :
                                arguments[3] ? arguments[3] :
                                    arguments[4] ? arguments[4] :
                                        HtmlParserDefinitions.fillAttrs[name] ? name : '';
                            attrs.push({
                                name: name,
                                value: value,
                                escaped: value.replace(/(^|[^\\])"/g, '$1\\\"')
                            });
                        });
                        this.start(tagName, attrs, unary);
                        return '';
                    };
                    HtmlParser.prototype.parseEndTag = function (tag, tagName) {
                        var pos;
                        if (!tagName)
                            pos = 0;
                        else {
                            for (pos = this._stack.length - 1; pos >= 0; pos--)
                                if (this._stack[pos] === tagName)
                                    break;
                        }
                        if (pos >= 0) {
                            for (var i = this._stack.length - 1; i >= pos; i--)
                                this.end(this._stack[i]);
                            this._stack.length = pos;
                        }
                        return '';
                    };
                    HtmlParser.prototype.start = function (tagName, attrs, unary) {
                        var elem = document.createElement(tagName);
                        for (var i = 0; i < attrs.length; i++) {
                            elem.setAttribute(attrs[i].name, attrs[i].value);
                        }
                        if (this._curParentNode && this._curParentNode.appendChild) {
                            this._curParentNode.appendChild(elem);
                        }
                        if (!unary) {
                            this._elems.push(elem);
                            this._curParentNode = elem;
                        }
                    };
                    HtmlParser.prototype.end = function (tag) {
                        if (this._elems.length === 1) {
                            this._topNodes.push(this._elems[0]);
                        }
                        this._elems.length -= 1;
                        this._curParentNode = this._elems[this._elems.length - 1];
                    };
                    HtmlParser.prototype.chars = function (text) {
                        var tx = text.trim();
                        if (tx.length === 0)
                            return;
                        if (text.indexOf('&') > -1) {
                            var node = document.createElement('div');
                            node.innerHTML = text;
                            text = node.textContent;
                            node.textContent = '';
                        }
                        if (this._elems.length === 0) {
                            this._topNodes.push(document.createTextNode(text));
                        }
                        else {
                            this._curParentNode.appendChild(document.createTextNode(text));
                        }
                    };
                    HtmlParser.prototype.html2Dom = function (html) {
                        this.parse(html.trim());
                        if (this._topNodes.length > 1) {
                            throw new Error('Wrapper must have root element. Templates with multiple root elements are not supported yet');
                        }
                        return (this._topNodes.length ? this._topNodes[0] : null);
                    };
                    HtmlParser.prototype.html2DomElements = function (html) {
                        this.parse(html.trim());
                        return this._topNodes;
                    };
                    return HtmlParser;
                }());
                Html2Dom.HtmlParser = HtmlParser;
            })(Html2Dom = Rendering.Html2Dom || (Rendering.Html2Dom = {}));
        })(Rendering = Lattice.Rendering || (Lattice.Rendering = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Rendering;
        (function (Rendering) {
            var Renderer = (function () {
                function Renderer(rootId, prefix, masterTable) {
                    this._columnsRenderFunctions = {};
                    this._masterTable = masterTable;
                    this._instances = masterTable.InstanceManager;
                    this.RootElement = document.getElementById(rootId);
                    this._rootId = rootId;
                    this._events = masterTable.Events;
                    this._prefix = prefix;
                    this.Executor = Reinforced.Lattice.Templating._ltcTpl.executor(prefix, masterTable);
                    this.BackBinder = new Rendering.BackBinder(this._masterTable.Date);
                }
                Renderer.prototype.layout = function () {
                    this._events.LayoutRendered.invokeBefore(this, null);
                    var rendered = this.Executor.executeLayout();
                    this.RootElement.innerHTML = rendered.Html;
                    var bodyMarker = this.RootElement.querySelector('[data-track="body"]');
                    if (!bodyMarker)
                        throw new Error('Body placeholder is missing in table layout template');
                    this.BodyElement = bodyMarker;
                    this.BodyElement.removeAttribute('data-track');
                    this.Locator = new Rendering.DOMLocator(this.BodyElement, this.RootElement, this._rootId);
                    this.Delegator = new Reinforced.Lattice.Services.EventsDelegatorService(this.Locator, this.BodyElement, this.RootElement, this._rootId, this._masterTable);
                    this.BackBinder.Delegator = this.Delegator;
                    this.Modifier = new Rendering.DOMModifier(this.Executor, this.Locator, this.BackBinder, this._instances, this.Delegator, this.BodyElement);
                    this.BackBinder.backBind(this.RootElement, rendered.BackbindInfo);
                    this._events.LayoutRendered.invokeAfter(this, null);
                };
                Renderer.prototype.body = function (rows) {
                    var process = this.Executor.beginProcess();
                    if (this._masterTable.Configuration.Lines != null && this._masterTable.Configuration.Lines.UseTemplate) {
                        var line = [];
                        var lineNum = 0;
                        for (var k = 0; k < rows.length; k++) {
                            line.push(rows[k]);
                            if (line.length === this._masterTable.Configuration.Lines.RowsInLine) {
                                Reinforced.Lattice.Templating.Driver.line(process, {
                                    Number: lineNum,
                                    Rows: line
                                });
                                line = [];
                                lineNum++;
                            }
                        }
                        if (line.length > 0) {
                            lineNum++;
                            Reinforced.Lattice.Templating.Driver.line(process, {
                                Number: lineNum,
                                Rows: line
                            });
                        }
                    }
                    else {
                        for (var i = 0; i < rows.length; i++) {
                            var rw = rows[i];
                            Reinforced.Lattice.Templating.Driver.row(process, rw);
                        }
                    }
                    var result = this.Executor.endProcess(process);
                    this.Delegator.handleElementDestroy(this.BodyElement);
                    if (Reinforced.Lattice.IeCheck.isIeGreater(9)) {
                        this.BodyElement.innerHTML = result.Html;
                    }
                    else {
                        var htmlParser = new Reinforced.Lattice.Rendering.Html2Dom.HtmlParser();
                        var elements = htmlParser.html2DomElements(result.Html);
                        while (this.BodyElement.firstChild) {
                            this.BodyElement.removeChild(this.BodyElement.firstChild);
                        }
                        for (var j = 0; j < elements.length; j++) {
                            this.BodyElement.appendChild(elements[j]);
                        }
                    }
                    this.BackBinder.backBind(this.BodyElement, result.BackbindInfo);
                    this._events.DataRendered.invokeAfter(this, null);
                };
                Renderer.prototype.renderObjectContent = function (renderable) {
                    var p = this.Executor.beginProcess();
                    p.nestContent(renderable, null);
                    return this.Executor.endProcess(p).Html;
                };
                Renderer.prototype.renderToString = function (templateId, viewModelBehind) {
                    var result = this.Executor.execute(viewModelBehind, templateId);
                    return result.Html;
                };
                Renderer.prototype.renderObject = function (templateId, viewModelBehind, targetSelector) {
                    var parent = document.querySelector(targetSelector);
                    return this.renderObjectTo(templateId, viewModelBehind, parent);
                };
                Renderer.prototype.renderObjectTo = function (templateId, viewModelBehind, target) {
                    var result = this.Executor.execute(viewModelBehind, templateId);
                    var parser = new Rendering.Html2Dom.HtmlParser();
                    var element = parser.html2DomElements(result.Html);
                    target.innerHTML = '';
                    for (var i = 0; i < element.length; i++) {
                        target.appendChild(element[i]);
                    }
                    this.BackBinder.backBind(target, result.BackbindInfo);
                    return target;
                };
                Renderer.prototype.clearBody = function () {
                    if (this.Delegator) {
                        this.Delegator.handleElementDestroy(this.BodyElement);
                    }
                    this.BodyElement.innerHTML = '';
                };
                return Renderer;
            }());
            Rendering.Renderer = Renderer;
        })(Rendering = Lattice.Rendering || (Lattice.Rendering = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Rendering;
        (function (Rendering) {
            var Resensor = (function () {
                function Resensor(element, handler) {
                    this._element = element;
                    this._handler = handler;
                    this._resizeBoud = this.onResized.bind(this);
                    this.requestAnimationFrame = window.requestAnimationFrame ||
                        window['mozRequestAnimationFrame'] ||
                        window['webkitRequestAnimationFrame'] ||
                        function (fn) {
                            return window.setTimeout(fn, 20);
                        };
                }
                Resensor.prototype.attach = function () {
                    this._sensor = document.createElement('div');
                    this._sensor.className = 'resize-sensor';
                    var style = 'position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: hidden; z-index: -1; visibility: hidden;';
                    var styleChild = 'position: absolute; left: 0; top: 0; transition: 0s;';
                    this._sensor.style.cssText = style;
                    this._sensor.innerHTML =
                        "<div class=\"resize-sensor-expand\" style=\"" + style + "\"><div style=\"" + styleChild + "\"></div></div><div class=\"resize-sensor-shrink\" style=\"" + style + "\"><div style=\"" + styleChild + " width: 200%; height: 200%\"></div></div>";
                    this._element.appendChild(this._sensor);
                    if (Resensor.getComputedStyle(this._element, 'position') == 'static') {
                        this._element.style.position = 'relative';
                    }
                    this._expand = this._sensor.childNodes.item(0);
                    this._expandChild = this._expand.childNodes[0];
                    this._shrink = this._sensor.childNodes[1];
                    this._lastWidth = this._element.offsetWidth;
                    this._lastHeight = this._element.offsetHeight;
                    this.reset();
                    Reinforced.Lattice.Services.EventsDelegatorService.addHandler(this._expand, 'scroll', this.onScroll.bind(this));
                    Reinforced.Lattice.Services.EventsDelegatorService.addHandler(this._shrink, 'scroll', this.onScroll.bind(this));
                };
                Resensor.prototype.onResized = function () {
                    this._rafId = 0;
                    if (!this._dirty)
                        return;
                    this._lastWidth = this._newWidth;
                    this._lastHeight = this._newHeight;
                    this._handler.call(this);
                };
                Resensor.prototype.onScroll = function () {
                    this._newWidth = this._element.offsetWidth;
                    this._newHeight = this._element.offsetHeight;
                    this._dirty = this._newWidth != this._lastWidth || this._newHeight != this._lastHeight;
                    var bnd = this._resizeBoud;
                    if (this._dirty && !this._rafId) {
                        this._rafId = this.requestAnimationFrame.call(window, function () { bnd(); });
                    }
                    this.reset();
                };
                Resensor.prototype.reset = function () {
                    this._expandChild.style.width = '100000px';
                    this._expandChild.style.height = '100000px';
                    this._expand.scrollLeft = 100000;
                    this._expand.scrollTop = 100000;
                    this._shrink.scrollLeft = 100000;
                    this._shrink.scrollTop = 100000;
                };
                Resensor.getComputedStyle = function (element, prop) {
                    if (element.currentStyle) {
                        return element.currentStyle[prop];
                    }
                    else if (window.getComputedStyle) {
                        return window.getComputedStyle(element, null).getPropertyValue(prop);
                    }
                    else {
                        return element.style[prop];
                    }
                };
                return Resensor;
            }());
            Rendering.Resensor = Resensor;
        })(Rendering = Lattice.Rendering || (Lattice.Rendering = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Rendering;
        (function (Rendering) {
            var VisualState = (function () {
                function VisualState() {
                    this.States = {};
                    this._subscribers = [];
                    this._stopEvents = false;
                    this.Current = '';
                }
                VisualState.prototype.subscribeStateChange = function (fn) {
                    this._subscribers.push(fn);
                };
                VisualState.prototype.fireHandlers = function (e) {
                    if (this._stopEvents)
                        return;
                    for (var i = 0; i < this._subscribers.length; i++) {
                        this._subscribers[i](e);
                    }
                };
                VisualState.prototype.changeState = function (state) {
                    this.setNormal();
                    if (!this.States[state])
                        return;
                    this.applyState(this.States[state]);
                    this.fireHandlers({ State: state, CurrentState: this.Current, StateWasMixedIn: false });
                };
                VisualState.prototype.mixinState = function (state) {
                    if (!this.States[state])
                        return;
                    this.Current += '+' + state;
                    this.applyState(this.States[state]);
                    this.fireHandlers({ State: state, CurrentState: this.Current, StateWasMixedIn: true });
                };
                VisualState.prototype.unmixinState = function (state) {
                    if (!this.States[state])
                        return;
                    var statesHistory = this.Current.split('+');
                    this._stopEvents = true;
                    this.normalState();
                    for (var i = 0; i < statesHistory.length; i++) {
                        if (statesHistory[i] !== null && statesHistory[i].length > 0 && statesHistory[i] !== state) {
                            this.mixinState(statesHistory[i]);
                        }
                    }
                    this._stopEvents = false;
                };
                VisualState.prototype.normalState = function () {
                    this.setNormal();
                };
                VisualState.prototype.applyState = function (desired) {
                    for (var i = 0; i < desired.length; i++) {
                        var ns = desired[i];
                        for (var k = 0; k < ns.classes.length; k++) {
                            var cls = ns.classes[k].substring(1);
                            if (ns.classes[k].charAt(0) === '+') {
                                if (!ns.Element.classList.contains(cls)) {
                                    ns.Element.classList.add(cls);
                                }
                            }
                            else {
                                if (ns.Element.classList.contains(cls)) {
                                    ns.Element.classList.remove(cls);
                                }
                            }
                        }
                        for (var ak in ns.attrs) {
                            if (ns.attrs.hasOwnProperty(ak)) {
                                if (ns.attrs[ak] == null) {
                                    if (ns.Element.hasAttribute(ak))
                                        ns.Element.removeAttribute(ak);
                                }
                                else {
                                    if ((!ns.Element.hasAttribute(ak)) || (ns.Element.getAttribute(ak) !== ns.attrs[ak])) {
                                        ns.Element.setAttribute(ak, ns.attrs[ak]);
                                    }
                                }
                            }
                        }
                        for (var sk in ns.styles) {
                            if (ns.styles.hasOwnProperty(sk)) {
                                if (ns.Element.style.getPropertyValue(sk) !== ns.styles[sk]) {
                                    ns.Element.style.setProperty(sk, ns.styles[sk]);
                                }
                            }
                        }
                        if (ns.content) {
                            var html = this.getContent(ns.Receiver, ns.content);
                            if (html.length > 0) {
                                ns.Element.innerHTML = html;
                            }
                            else {
                                ns.Element.innerHTML = html;
                            }
                        }
                    }
                };
                VisualState.prototype.getContent = function (receiver, contentLocation) {
                    var path = contentLocation.split('.');
                    var co = receiver;
                    for (var i = 0; i < path.length; i++) {
                        if (i === 0 && path[0] === 'o')
                            continue;
                        co = co[path[i]];
                        if (co == null || co == undefined) {
                            throw new Error("Visual state owner does not contain property or function " + contentLocation);
                        }
                    }
                    var html = '';
                    if (typeof co === 'function') {
                        html = co.call(receiver);
                    }
                    else {
                        html = co;
                    }
                    return html;
                };
                VisualState.prototype.setNormal = function () {
                    this.Current = 'normal';
                    this.fireHandlers({ State: 'normal', CurrentState: this.Current, StateWasMixedIn: false });
                    var normal = this.States['_normal'];
                    for (var i = 0; i < normal.length; i++) {
                        var ns = normal[i];
                        var classes = ns.classes.join(' ');
                        if ((!ns.Element.hasAttribute('class') && classes.length > 0) || (ns.Element.getAttribute('class') !== classes)) {
                            ns.Element.setAttribute('class', classes);
                        }
                        if (ns.Element.innerHTML !== ns.content && ns.content != null)
                            ns.Element.innerHTML = ns.content;
                        for (var ak in ns.attrs) {
                            if (ns.attrs.hasOwnProperty(ak)) {
                                if (ns.attrs[ak] == null) {
                                    if (ns.Element.hasAttribute(ak))
                                        ns.Element.removeAttribute(ak);
                                }
                                else {
                                    if ((!ns.Element.hasAttribute(ak)) || (ns.Element.getAttribute(ak) !== ns.attrs[ak])) {
                                        ns.Element.setAttribute(ak, ns.attrs[ak]);
                                    }
                                }
                            }
                        }
                        for (var sk in ns.styles) {
                            if (ns.styles.hasOwnProperty(sk)) {
                                if (ns.Element.style.getPropertyValue(sk) !== ns.styles[sk]) {
                                    ns.Element.style.setProperty(sk, ns.styles[sk]);
                                }
                            }
                        }
                    }
                };
                return VisualState;
            }());
            Rendering.VisualState = VisualState;
        })(Rendering = Lattice.Rendering || (Lattice.Rendering = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Services;
        (function (Services) {
            var CommandsService = (function () {
                function CommandsService(masterTable) {
                    this._masterTable = masterTable;
                    this._commandsCache = this._masterTable.Configuration.Commands;
                }
                CommandsService.prototype.canExecute = function (commandName, subject) {
                    if (subject === void 0) { subject = null; }
                    if (!this._commandsCache.hasOwnProperty(commandName))
                        return true;
                    var command = this._commandsCache[commandName];
                    if (command.CanExecute) {
                        return command.CanExecute({ Subject: subject, Master: this._masterTable });
                    }
                    return true;
                };
                CommandsService.prototype.triggerCommandOnRow = function (commandName, rowIndex, callback) {
                    if (callback === void 0) { callback = null; }
                    this.triggerCommand(commandName, this._masterTable.DataHolder.StoredCache[rowIndex], callback);
                };
                CommandsService.prototype.triggerCommand = function (commandName, subject, callback) {
                    var _this = this;
                    if (callback === void 0) { callback = null; }
                    var command = this._commandsCache[commandName];
                    if (command == null || command == undefined) {
                        this.triggerCommandWithConfirmation(commandName, subject, null, callback);
                        return;
                    }
                    if (command.CanExecute) {
                        if (!command.CanExecute({ Subject: subject, Master: this._masterTable }))
                            return;
                    }
                    if (command.Confirmation != null && command.Confirmation != undefined) {
                        var tc = new ConfirmationWindowViewModel(this._masterTable, command, subject, callback);
                        tc.init(function () {
                            var r = _this._masterTable.Renderer
                                .renderObject(command.Confirmation.TemplateId, tc, command.Confirmation.TargetSelector);
                            tc.RootElement = r;
                            tc.rendered();
                        });
                    }
                    else if (command.ConfirmationDataFunction != null && command.ConfirmationDataFunction != undefined) {
                        var confirmationData = command.ConfirmationDataFunction({
                            CommandDescription: this._commandsCache[commandName],
                            Master: this._masterTable,
                            Selection: this._masterTable.Selection.getSelectedObjects(),
                            Subject: subject,
                            Result: null,
                            Confirmation: null,
                            confirm: null,
                            dismiss: null,
                            Details: null
                        });
                        if (confirmationData != null) {
                            this.triggerCommandWithConfirmation(commandName, subject, confirmationData, callback);
                        }
                    }
                    else {
                        this.triggerCommandWithConfirmation(commandName, subject, null, callback);
                    }
                };
                CommandsService.prototype.redrawSubjectRow = function (subject, command) {
                    if (subject != null && subject != undefined) {
                        var row = this._masterTable.Controller.produceRow(subject);
                        row.Command = command;
                        this._masterTable.Renderer.Modifier.redrawRow(row);
                    }
                };
                CommandsService.prototype.restoreSubjectRow = function (subject) {
                    if (subject != null && subject != undefined) {
                        this._masterTable.Controller.redrawVisibleDataObject(subject);
                    }
                };
                CommandsService.prototype.triggerCommandWithConfirmation = function (commandName, subject, confirmation, callback) {
                    var _this = this;
                    if (callback === void 0) { callback = null; }
                    var params = {
                        CommandDescription: null,
                        Master: this._masterTable,
                        Selection: this._masterTable.Selection.getSelectedObjects(),
                        Subject: subject,
                        Result: null,
                        Confirmation: confirmation,
                        confirm: null,
                        dismiss: null,
                        Details: null
                    };
                    this.redrawSubjectRow(subject, params);
                    var cmd = this._commandsCache[commandName];
                    if (cmd == null || cmd == undefined) {
                        this._masterTable.Loader.command(commandName, function (r) {
                            _this.restoreSubjectRow(subject);
                            params.Result = r;
                            if (callback)
                                callback(params);
                            if (r.$isDeferred && r.$url) {
                                window.location.href = r.$url;
                                return;
                            }
                        }, function (q) {
                            q.AdditionalData['CommandConfirmation'] = JSON.stringify(confirmation);
                            q.AdditionalData['CommandSubject'] = JSON.stringify(subject);
                            return q;
                        }, function (data) {
                            _this.restoreSubjectRow(subject);
                        });
                        return;
                    }
                    params.CommandDescription = cmd;
                    if (cmd.CanExecute) {
                        if (!cmd.CanExecute({ Subject: subject, Master: this._masterTable })) {
                            this.restoreSubjectRow(subject);
                            return;
                        }
                    }
                    if (cmd.OnBeforeExecute != null && cmd.OnBeforeExecute != undefined) {
                        params.Confirmation = cmd.OnBeforeExecute(params);
                    }
                    if (cmd.Type === Reinforced.Lattice.Commands.CommandType.Server) {
                        this._masterTable.Loader.command(cmd.ServerName, function (r) {
                            _this.restoreSubjectRow(subject);
                            params.Result = r;
                            if (callback)
                                callback(params);
                            if (cmd.OnSuccess)
                                cmd.OnSuccess(params);
                            if (r.$isDeferred && r.$url) {
                                window.location.href = r.$url;
                                return;
                            }
                        }, function (q) {
                            q.AdditionalData['CommandConfirmation'] = JSON.stringify(confirmation);
                            q.AdditionalData['CommandSubject'] = JSON.stringify(subject);
                            return q;
                        }, function (r) {
                            _this.restoreSubjectRow(subject);
                            params.Result = r;
                            if (callback)
                                callback(params);
                            if (cmd.OnFailure)
                                cmd.OnFailure(params);
                        });
                    }
                    else {
                        var err = null;
                        var isError = false;
                        var reslt = null;
                        try {
                            reslt = cmd.ClientFunction(params);
                        }
                        catch (e) {
                            err = e;
                            isError = true;
                        }
                        this.restoreSubjectRow(subject);
                        if (isError) {
                            params.Result = err;
                            if (callback)
                                callback(params);
                            if (cmd.OnFailure)
                                cmd.OnFailure(params);
                        }
                        else {
                            params.Result = reslt;
                            if (callback)
                                callback(params);
                            if (cmd.OnSuccess)
                                cmd.OnSuccess(params);
                        }
                        if (typeof reslt === 'function') {
                            reslt();
                        }
                    }
                };
                return CommandsService;
            }());
            Services.CommandsService = CommandsService;
            var ConfirmationWindowViewModel = (function () {
                function ConfirmationWindowViewModel(masterTable, commandDescription, subject, originalCallback) {
                    this.Command = null;
                    this.DisplayIndex = -1;
                    this.IsLast = false;
                    this.RootElement = null;
                    this.ContentPlaceholder = null;
                    this.DetailsPlaceholder = null;
                    this.TemplatePieces = {};
                    this.RecentDetails = { Data: null };
                    this._detailsLoaded = false;
                    this._editorColumn = {};
                    this._originalCallback = null;
                    this._autoformFields = {};
                    this._loadDetailsTimeout = null;
                    this._isloadingContent = false;
                    this.EditorsSet = {};
                    this.ActiveEditors = [];
                    this.ValidationMessages = [];
                    this.MasterTable = masterTable;
                    this._commandDescription = commandDescription;
                    this._config = commandDescription.Confirmation;
                    this._originalCallback = originalCallback;
                    this.DataObject = {};
                    this._editorObjectModified = {};
                    this.Subject = subject;
                    this.Selection = this.MasterTable.Selection.getSelectedObjects();
                    this._embedBound = this.embedConfirmation.bind(this);
                    if (commandDescription.Confirmation.Autoform != null) {
                        this.produceAutoformColumns(commandDescription.Confirmation.Autoform);
                    }
                }
                ConfirmationWindowViewModel.prototype.init = function (continuation) {
                    var _this = this;
                    var tplParams = {
                        CommandDescription: this._commandDescription,
                        Master: this.MasterTable,
                        Confirmation: this._editorObjectModified,
                        Result: null,
                        Selection: this.Selection,
                        Subject: this.Subject,
                        confirm: null,
                        dismiss: null,
                        Details: null
                    };
                    if (this._commandDescription.Confirmation.InitConfirmationObject) {
                        this._commandDescription.Confirmation.InitConfirmationObject(this.DataObject, tplParams, function () {
                            _this.initContinuation(tplParams, continuation);
                        });
                    }
                    else {
                        this.initContinuation(tplParams, continuation);
                    }
                };
                ConfirmationWindowViewModel.prototype.initContinuation = function (tplParams, continuation) {
                    if (this._commandDescription.Confirmation.InitConfirmationObject) {
                        var confirmationObject = this.DataObject;
                        for (var eo in confirmationObject) {
                            if (confirmationObject.hasOwnProperty(eo)) {
                                this._editorObjectModified[eo] = confirmationObject[eo];
                            }
                        }
                    }
                    if (this._commandDescription.Confirmation.Autoform != null) {
                        this.initAutoform(this._commandDescription.Confirmation.Autoform);
                    }
                    var templatePieces = this._config.TemplatePieces;
                    for (var k in templatePieces) {
                        if (templatePieces.hasOwnProperty(k)) {
                            this.TemplatePieces[k] = templatePieces[k](tplParams);
                        }
                    }
                    if (continuation)
                        continuation();
                };
                ConfirmationWindowViewModel.prototype.rendered = function () {
                    this.stripNotRenderedEditors();
                    for (var i = 0; i < this.ActiveEditors.length; i++) {
                        var k = this.ActiveEditors[i].FieldName;
                        this.ActiveEditors[i].IsInitialValueSetting = true;
                        this.ActiveEditors[i].setValue(this.DataObject[k]);
                        this.ActiveEditors[i].IsInitialValueSetting = false;
                    }
                    this.initFormWatchDatepickers(this.RootElement);
                    this.loadContent();
                    if (this._config.Details != null && this._config.Details != undefined) {
                        if (this._config.Details.LoadImmediately)
                            this.loadDetailsInternal();
                    }
                };
                ConfirmationWindowViewModel.prototype.stripNotRenderedEditors = function () {
                    var newEditors = [];
                    for (var i = 0; i < this.ActiveEditors.length; i++) {
                        if (this.ActiveEditors[i]["_IsRendered"])
                            newEditors.push(this.ActiveEditors[i]);
                    }
                    if (newEditors.length === this.ActiveEditors.length)
                        return;
                    this.ActiveEditors = newEditors;
                    this.EditorsSet = {};
                    for (var j = 0; j < newEditors.length; j++) {
                        this.EditorsSet[newEditors[j].FieldName] = newEditors[j];
                    }
                };
                ConfirmationWindowViewModel.prototype.loadContent = function () {
                    var _this = this;
                    if (this.ContentPlaceholder == null)
                        return;
                    if ((!this._config.ContentLoadingUrl) && (!this._config.ContentLoadingCommand))
                        return;
                    if (this.VisualStates != null)
                        this.VisualStates.mixinState('contentLoading');
                    if (this._config.Autoform != null && this._config.Autoform.DisableWhenContentLoading) {
                        for (var i = 0; i < this.ActiveEditors.length; i++) {
                            if (this.ActiveEditors[i].VisualStates != null)
                                this.ActiveEditors[i].VisualStates.mixinState('loading');
                        }
                    }
                    this._isloadingContent = true;
                    if (this._config.ContentLoadingUrl != null && this._config.ContentLoadingUrl != undefined) {
                        var url = this._config.ContentLoadingUrl(this.Subject);
                        this.loadContentByUrl(url, this._config.ContentLoadingMethod || 'GET');
                    }
                    else {
                        this.MasterTable.Loader.command(this._config.ContentLoadingCommand, function (r) {
                            if (!_this.ContentPlaceholder)
                                return;
                            _this.ContentPlaceholder.innerHTML = r;
                            _this.initFormWatchDatepickers(_this.ContentPlaceholder);
                            _this.contentLoaded();
                        }, this._embedBound, function (r) {
                            _this.ContentPlaceholder.innerHTML = r;
                            _this.contentLoaded();
                        });
                    }
                };
                ConfirmationWindowViewModel.prototype.contentLoaded = function () {
                    this._isloadingContent = false;
                    if (this.VisualStates != null)
                        this.VisualStates.unmixinState('contentLoading');
                    if (this._config.Autoform != null && this._config.Autoform.DisableWhenContentLoading) {
                        for (var i = 0; i < this.ActiveEditors.length; i++) {
                            if (this.ActiveEditors[i].VisualStates != null)
                                this.ActiveEditors[i].VisualStates.unmixinState('loading');
                        }
                    }
                    if (this._config.OnContentLoaded)
                        this._config.OnContentLoaded(this.collectCommandParameters());
                };
                ConfirmationWindowViewModel.prototype.loadContentByUrl = function (url, method) {
                    var _this = this;
                    url = encodeURI(url);
                    var req = this.MasterTable.Loader.createXmlHttp();
                    req.open(method, url, true);
                    req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                    var reqEvent = req.onload ? 'onload' : 'onreadystatechange';
                    req[reqEvent] = (function () {
                        if (req.readyState !== 4)
                            return false;
                        _this.ContentPlaceholder.innerHTML = req.responseText;
                        _this.contentLoaded();
                    });
                    if (method === 'GET' || this.Subject === null)
                        req.send();
                    else
                        req.send(JSON.stringify(this.Subject));
                };
                ConfirmationWindowViewModel.prototype.loadDetails = function () {
                    var _this = this;
                    if (this.DetailsPlaceholder == null)
                        return;
                    if (this._config.Details == null || this._config.Details == undefined)
                        return;
                    if (this._config.Details.LoadDelay <= 0) {
                        this.loadDetailsInternal();
                    }
                    else {
                        clearTimeout(this._loadDetailsTimeout);
                        this._loadDetailsTimeout = setTimeout(function () {
                            _this.loadDetailsInternal();
                        }, this._config.Details.LoadDelay);
                    }
                };
                ConfirmationWindowViewModel.prototype.loadDetailsInternal = function () {
                    var _this = this;
                    var parameters = this.collectCommandParameters();
                    if (this._config.Details.ValidateToLoad != null) {
                        if (!this._config.Details.ValidateToLoad(parameters))
                            return;
                    }
                    if (this.VisualStates != null)
                        this.VisualStates.mixinState('detailsLoading');
                    if (this._config.Autoform != null && this._config.Autoform.DisableWhileDetailsLoading) {
                        for (var i = 0; i < this.ActiveEditors.length; i++) {
                            if (this.ActiveEditors[i].VisualStates != null)
                                this.ActiveEditors[i].VisualStates.mixinState('loading');
                        }
                    }
                    if (this._config.Details.CommandName != null && this._config.Details.CommandName != undefined) {
                        this.MasterTable.Loader.command(this._config.Details.CommandName, function (r) {
                            _this.detailsLoaded(r);
                        }, this._embedBound, function (r) {
                            _this.detailsLoaded(r);
                        });
                    }
                    else if (this._config.Details.DetailsFunction != null && this._config.Details.DetailsFunction != undefined) {
                        this.detailsLoaded(this._config.Details.DetailsFunction(parameters));
                    }
                    else {
                        this.detailsLoaded(this.getConfirmation());
                    }
                };
                ConfirmationWindowViewModel.prototype.detailsLoaded = function (detailsResult) {
                    if (detailsResult != null && detailsResult != undefined && !(!this.DetailsPlaceholder)) {
                        if (typeof detailsResult == 'string') {
                            this.DetailsPlaceholder.innerHTML = detailsResult;
                            this.initFormWatchDatepickers(this.DetailsPlaceholder);
                        }
                        else {
                            if (this._config.Details.TempalteId != null && this._config.Details.TempalteId != undefined) {
                                if (this.RecentDetails.Data != null) {
                                    this.MasterTable.Renderer.Modifier.cleanElement(this.DetailsPlaceholder);
                                }
                                var param = {
                                    Subject: this.Subject,
                                    Details: detailsResult,
                                    Confirmation: this.getConfirmation()
                                };
                                this.MasterTable.Renderer
                                    .renderObjectTo(this._config.Details.TempalteId, param, this.DetailsPlaceholder);
                                this.initFormWatchDatepickers(this.DetailsPlaceholder);
                            }
                            else {
                                this.DetailsPlaceholder.innerHTML = detailsResult.toString();
                                this.initFormWatchDatepickers(this.DetailsPlaceholder);
                            }
                        }
                    }
                    this._detailsLoaded = true;
                    this.RecentDetails.Data = detailsResult;
                    if (this.VisualStates != null)
                        this.VisualStates.unmixinState('detailsLoading');
                    if (this._config.Autoform != null && this._config.Autoform.DisableWhileDetailsLoading) {
                        for (var i = 0; i < this.ActiveEditors.length; i++) {
                            if (this.ActiveEditors[i].VisualStates != null)
                                this.ActiveEditors[i].VisualStates.unmixinState('loading');
                        }
                    }
                    if (this._config.OnDetailsLoaded)
                        this._config.OnDetailsLoaded(this.collectCommandParameters());
                };
                ConfirmationWindowViewModel.prototype.embedConfirmation = function (q) {
                    q.AdditionalData['CommandConfirmation'] = JSON.stringify(this.getConfirmation());
                    q.AdditionalData['CommandSubject'] = JSON.stringify(this.Subject);
                    return q;
                };
                ConfirmationWindowViewModel.prototype.collectCommandParameters = function () {
                    var result = {
                        CommandDescription: this._commandDescription,
                        Master: this.MasterTable,
                        Selection: this.Selection,
                        Subject: this.Subject,
                        Result: null,
                        Confirmation: this.getConfirmation(),
                        confirm: this.confirm.bind(this),
                        dismiss: this.dismiss.bind(this),
                        Details: this.RecentDetails.Data
                    };
                    return result;
                };
                ConfirmationWindowViewModel.prototype.getConfirmation = function () {
                    var confirmation = null;
                    if (this._config.Formwatch != null) {
                        confirmation = Reinforced.Lattice.Plugins.Formwatch.FormwatchPlugin.extractFormData(this._config.Formwatch, this.RootElement, this.MasterTable.Date);
                    }
                    if (this._config.Autoform != null) {
                        if (!this._isloadingContent)
                            this.collectAutoForm();
                    }
                    if (this._editorObjectModified != null) {
                        if (confirmation == null)
                            confirmation = {};
                        var confirmationObject = this._editorObjectModified;
                        for (var eo in confirmationObject) {
                            if (confirmationObject.hasOwnProperty(eo)) {
                                confirmation[eo] = confirmationObject[eo];
                            }
                        }
                    }
                    return confirmation;
                };
                ConfirmationWindowViewModel.prototype.initFormWatchDatepickers = function (parent) {
                    var formWatch = this._commandDescription.Confirmation.Formwatch;
                    if (formWatch != null) {
                        for (var i = 0; i < formWatch.length; i++) {
                            var conf = formWatch[i];
                            if (conf.TriggerSearchOnEvents && conf.TriggerSearchOnEvents.length > 0) {
                                var element = parent.querySelector(conf.FieldSelector);
                                if (conf.AutomaticallyAttachDatepicker) {
                                    this.MasterTable.Date.createDatePicker(element);
                                }
                            }
                        }
                    }
                };
                ConfirmationWindowViewModel.prototype.confirm = function () {
                    var _this = this;
                    var params = this.collectCommandParameters();
                    if (this.ValidationMessages.length > 0)
                        return;
                    if (this.VisualStates != null)
                        this.VisualStates.mixinState('execution');
                    if (this._config.Autoform != null && this._config.Autoform.DisableWhenContentLoading) {
                        for (var i = 0; i < this.ActiveEditors.length; i++) {
                            if (this.ActiveEditors[i].VisualStates != null)
                                this.ActiveEditors[i].VisualStates.mixinState('saving');
                        }
                    }
                    if (this._config.OnCommit)
                        this._config.OnCommit(params);
                    this.MasterTable.Commands.triggerCommandWithConfirmation(this._commandDescription.Name, this.Subject, this.getConfirmation(), function (r) {
                        params.Result = r;
                        _this.RootElement = null;
                        _this.ContentPlaceholder = null;
                        _this.DetailsPlaceholder = null;
                        _this.MasterTable.Renderer.Modifier.cleanSelector(_this._commandDescription.Confirmation.TargetSelector);
                        if (_this.VisualStates != null)
                            _this.VisualStates.unmixinState('execution');
                        if (_this._originalCallback)
                            _this._originalCallback(params);
                    });
                };
                ConfirmationWindowViewModel.prototype.dismiss = function () {
                    var params = this.collectCommandParameters();
                    this.MasterTable.Renderer.Modifier.cleanSelector(this._commandDescription.Confirmation.TargetSelector);
                    this.RootElement = null;
                    this.ContentPlaceholder = null;
                    this.DetailsPlaceholder = null;
                    if (this._config.OnDismiss)
                        this._config.OnDismiss(params);
                    if (this._originalCallback)
                        this._originalCallback(params);
                };
                ConfirmationWindowViewModel.prototype.Editors = function (p) {
                    for (var i = 0; i < this.ActiveEditors.length; i++) {
                        this.editor(p, this.ActiveEditors[i]);
                    }
                };
                ConfirmationWindowViewModel.prototype.editor = function (p, editor) {
                    editor['_IsRendered'] = true;
                    editor.renderContent(p);
                };
                ConfirmationWindowViewModel.prototype.Editor = function (p, fieldName) {
                    var editor = this.EditorsSet[fieldName];
                    if (editor == null || editor == undefined)
                        return;
                    this.editor(p, editor);
                };
                ConfirmationWindowViewModel.prototype.createEditor = function (fieldName, column) {
                    var editorConf = this._autoformFields[fieldName];
                    var editor = Lattice.ComponentsContainer.resolveComponent(editorConf.PluginId);
                    editor.DataObject = this.DataObject;
                    editor.ModifiedDataObject = this._editorObjectModified;
                    editor.Data = this.DataObject[fieldName];
                    editor.FieldName = fieldName;
                    editor.Column = column;
                    editor.CanComplete = false;
                    editor.IsFormEdit = true;
                    editor.IsRowEdit = false;
                    editor.IsCellEdit = !(editor.IsFormEdit || editor.IsRowEdit);
                    editor.Row = this;
                    editor.RawConfig = { Configuration: editorConf, Order: 0, PluginId: editorConf.PluginId, Placement: '', TemplateId: editorConf.TemplateId };
                    editor.init(this.MasterTable);
                    return editor;
                };
                ConfirmationWindowViewModel.prototype.defaultValue = function (col) {
                    if (col.IsInteger || col.IsFloat)
                        return 0;
                    if (col.IsBoolean)
                        return false;
                    if (col.IsDateTime)
                        return new Date();
                    if (col.IsString)
                        return '';
                    if (col.IsEnum)
                        return 0;
                    if (col.Configuration.IsNullable)
                        return null;
                    return null;
                };
                ConfirmationWindowViewModel.prototype.produceAutoformColumns = function (autoform) {
                    var fields = autoform.Autoform;
                    for (var i = 0; i < fields.length; i++) {
                        this._autoformFields[fields[i].FieldName] = fields[i];
                    }
                    for (var j = 0; j < fields.length; j++) {
                        this._editorColumn[fields[j].FieldName] = Reinforced.Lattice.Services.InstanceManagerService.createColumn(fields[j].FakeColumn, this.MasterTable);
                        this.DataObject[fields[j].FieldName] = this
                            .defaultValue(this._editorColumn[fields[j].FieldName]);
                        this._editorObjectModified[fields[j].FieldName] = this.DataObject[fields[j].FieldName];
                    }
                };
                ConfirmationWindowViewModel.prototype.initAutoform = function (autoform) {
                    var fields = autoform.Autoform;
                    for (var i = 0; i < fields.length; i++) {
                        var editorConf = fields[i];
                        var column = this._editorColumn[editorConf.FieldName];
                        var editor = this.createEditor(editorConf.FieldName, column);
                        this.EditorsSet[editorConf.FieldName] = editor;
                        this.ActiveEditors.push(editor);
                    }
                };
                ConfirmationWindowViewModel.prototype.notifyChanged = function (editor) {
                    this.retrieveEditorData(editor);
                    for (var i = 0; i < this.ActiveEditors.length; i++) {
                        this.ActiveEditors[i].notifyObjectChanged();
                    }
                    if (this._config.Details != null && this._config.Details != undefined) {
                        if ((!this._config.Details.LoadOnce) || (!this._detailsLoaded)) {
                            this.loadDetails();
                        }
                    }
                };
                ConfirmationWindowViewModel.prototype.reject = function (editor) {
                    this._editorObjectModified[editor.FieldName] = this.DataObject[editor.FieldName];
                    this.setEditorValue(editor);
                };
                ConfirmationWindowViewModel.prototype.commit = function (editor) {
                    var idx = this.ActiveEditors.indexOf(editor);
                    if (this.ActiveEditors.length > idx + 1) {
                        idx = -1;
                        for (var i = 0; i < this.ActiveEditors.length; i++) {
                            if (!this.ActiveEditors[i].IsValid) {
                                idx = i;
                                break;
                            }
                        }
                        if (idx !== -1)
                            this.ActiveEditors[idx].focus();
                    }
                };
                ConfirmationWindowViewModel.prototype.retrieveEditorData = function (editor, errors) {
                    var errorsArrayPresent = (!(!errors));
                    errors = errors || [];
                    var thisErrors = [];
                    this._editorObjectModified[editor.FieldName] = editor.getValue(thisErrors);
                    for (var j = 0; j < thisErrors.length; j++) {
                        thisErrors[j].Message = editor.getErrorMessage(thisErrors[j].Code);
                    }
                    editor.Data = this._editorObjectModified[editor.FieldName];
                    editor.ValidationMessages = thisErrors;
                    for (var i = 0; i < thisErrors.length; i++) {
                        errors.push(thisErrors[i]);
                    }
                    if (thisErrors.length > 0) {
                        editor.IsValid = false;
                        if (editor.VisualStates != null)
                            editor.VisualStates.changeState('invalid');
                    }
                    else {
                        editor.IsValid = true;
                        if (editor.VisualStates != null)
                            editor.VisualStates.normalState();
                    }
                    if (!errorsArrayPresent) {
                        this.ValidationMessages.concat(errors);
                    }
                };
                ConfirmationWindowViewModel.prototype.setEditorValue = function (editor) {
                    editor.IsInitialValueSetting = true;
                    editor.setValue(this._editorObjectModified[editor.FieldName]);
                    editor.IsInitialValueSetting = false;
                };
                ConfirmationWindowViewModel.prototype.collectAutoForm = function () {
                    this.ValidationMessages = [];
                    var errors = [];
                    for (var i = 0; i < this.ActiveEditors.length; i++) {
                        this.retrieveEditorData(this.ActiveEditors[i], errors);
                    }
                    this.ValidationMessages = errors;
                    if (this.ValidationMessages.length > 0) {
                        this.MasterTable.Events.EditValidationFailed.invokeAfter(this, {
                            OriginalDataObject: this.DataObject,
                            ModifiedDataObject: this._editorObjectModified,
                            Messages: this.ValidationMessages
                        });
                        return false;
                    }
                    return true;
                };
                return ConfirmationWindowViewModel;
            }());
            Services.ConfirmationWindowViewModel = ConfirmationWindowViewModel;
        })(Services = Lattice.Services || (Lattice.Services = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Services;
        (function (Services) {
            var Controller = (function () {
                function Controller(masterTable) {
                    this._additionalRowsProviders = [];
                    this._masterTable = masterTable;
                    masterTable.Loader.registerAdditionalDataReceiver("Reload", this);
                }
                Controller.prototype.registerAdditionalRowsProvider = function (provider) {
                    this._additionalRowsProviders.push(provider);
                };
                Controller.prototype.reload = function (forceServer, callback) {
                    var _this = this;
                    this._masterTable.Loader.query(function (e) {
                        if (e == null) {
                            _this.redrawVisibleData();
                            return;
                        }
                        if (e['Success'] === false && e['Message'] && e['Message']['__Go7XIV13OA'] === true) {
                            return;
                        }
                        _this.redrawVisibleData();
                        if (callback != null)
                            callback();
                    }, null, null, forceServer);
                };
                Controller.prototype.redrawVisibleDataObject = function (dataObject) {
                    var d = dataObject['__i'];
                    dataObject = this._masterTable.DataHolder.StoredCache[d];
                    if (!dataObject)
                        return null;
                    if (this._masterTable.DataHolder.DisplayedData.indexOf(dataObject) < 0)
                        return null;
                    var row = this.produceRow(dataObject);
                    return this._masterTable.Renderer.Modifier.redrawRow(row);
                };
                Controller.prototype.redrawVisibleData = function () {
                    var rows = this.produceRows();
                    this._masterTable.Renderer.body(rows);
                };
                Controller.prototype.replaceVisibleData = function (rows) {
                    this._masterTable.Renderer.body(rows);
                };
                Controller.prototype.redrawVisibleCells = function (dataObject, columns) {
                    var dispIndex = this._masterTable.DataHolder.localLookupDisplayedDataObject(dataObject);
                    if (dispIndex == null)
                        throw new Error('Cannot redraw cells because proposed object it is not displaying currently');
                    var row = this.produceRow(dataObject);
                    for (var i = 0; i < columns.length; i++) {
                        if (row.Cells.hasOwnProperty(columns[i].RawName)) {
                            this._masterTable.Renderer.Modifier.redrawCell(row.Cells[columns[i].RawName]);
                        }
                    }
                };
                Controller.prototype.redrawColumns = function (columns) {
                    var rows = this.produceRows();
                    for (var i = 0; i < rows.length; i++) {
                        for (var j = 0; j < columns.length; j++) {
                            this._masterTable.Renderer.Modifier.redrawCell(rows[i].Cells[columns[j].RawName]);
                        }
                    }
                };
                Controller.prototype.drawAdjustmentResult = function (adjustmentResult) {
                    this._masterTable.Events.AdjustmentRender.invokeBefore(this, adjustmentResult);
                    if (adjustmentResult.NeedRedrawAll) {
                        this.reload();
                        this._masterTable.Events.AdjustmentRender.invokeAfter(this, adjustmentResult);
                        return;
                    }
                    if (adjustmentResult.NeedRefilter) {
                        this._masterTable.DataHolder.filterStoredDataWithPreviousQuery();
                    }
                    var rows = this.produceRows();
                    for (var i = 0; i < rows.length; i++) {
                        var needRedrawRow = false;
                        var cellsToRedraw = [];
                        if (adjustmentResult.AddedData.indexOf(rows[i]) > -1) {
                            rows[i].IsAdded = true;
                            needRedrawRow = true;
                        }
                        else {
                            var adjIdx = adjustmentResult.TouchedData.indexOf(rows[i].DataObject);
                            if (adjIdx > -1) {
                                rows[i].IsUpdated = true;
                                needRedrawRow = true;
                                var cols = adjustmentResult.TouchedColumns[adjIdx];
                                for (var j = 0; j < cols.length; j++) {
                                    if (!rows[i].Cells.hasOwnProperty(cols[j]))
                                        continue;
                                    var cell = rows[i].Cells[cols[j]];
                                    cell.IsUpdated = true;
                                    cellsToRedraw.push(cell);
                                }
                            }
                        }
                        if (!adjustmentResult.NeedRefilter) {
                            if (needRedrawRow) {
                                this._masterTable.Renderer.Modifier.redrawRow(rows[i]);
                            }
                            else {
                                if (cellsToRedraw.length > 0) {
                                    for (var k = 0; k < cellsToRedraw.length; k++) {
                                        this._masterTable.Renderer.Modifier.redrawCell(cellsToRedraw[k]);
                                    }
                                }
                            }
                        }
                    }
                    if (adjustmentResult.NeedRefilter) {
                        if (rows.length == 0)
                            this.redrawVisibleData();
                        else
                            this._masterTable.Renderer.body(rows);
                    }
                    this._masterTable.Events.AdjustmentRender.invokeAfter(this, adjustmentResult);
                };
                Controller.prototype.produceCell = function (dataObject, column, row) {
                    return {
                        Column: column,
                        Data: dataObject[column.RawName],
                        DataObject: dataObject,
                        Row: row,
                        renderContent: null,
                        renderElement: null,
                        IsSelected: this._masterTable.Selection.isCellSelected(dataObject, column)
                    };
                };
                Controller.prototype.produceRow = function (dataObject, columns) {
                    if (!dataObject)
                        return null;
                    if (!columns)
                        columns = this._masterTable.InstanceManager.getUiColumns();
                    var isLast = this._masterTable.DataHolder.DisplayedData.length == 0
                        ? true
                        : (this._masterTable.DataHolder.DisplayedData[this._masterTable.DataHolder.DisplayedData.length - 1] ==
                            dataObject);
                    var rw = {
                        DataObject: dataObject,
                        Index: dataObject['__i'],
                        MasterTable: this._masterTable,
                        IsSelected: this._masterTable.Selection.isSelected(dataObject),
                        CanBeSelected: this._masterTable.Selection.canSelect(dataObject),
                        Cells: null,
                        Command: null,
                        DisplayIndex: this._masterTable.DataHolder.DisplayedData.indexOf(dataObject),
                        IsLast: isLast
                    };
                    var cells = {};
                    for (var j = 0; j < columns.length; j++) {
                        var col = columns[j];
                        var cell = this.produceCell(dataObject, col, rw);
                        cells[col.RawName] = cell;
                    }
                    rw.Cells = cells;
                    return rw;
                };
                Controller.prototype.produceRowsFromData = function (data) {
                    this._masterTable.Events.DataRendered.invokeBefore(this, null);
                    var result = [];
                    var columns = this._masterTable.InstanceManager.getUiColumns();
                    for (var i = 0; i < data.length; i++) {
                        var obj = data[i];
                        var row = this.produceRow(obj, columns);
                        if (!row)
                            continue;
                        row.DisplayIndex = i;
                        row.IsLast = i === (data.length - 1);
                        result.push(row);
                    }
                    return result;
                };
                Controller.prototype.produceRows = function () {
                    var result = this.produceRowsFromData(this._masterTable.DataHolder.DisplayedData);
                    var l1 = result.length;
                    for (var j = 0; j < this._additionalRowsProviders.length; j++) {
                        this._additionalRowsProviders[j].provide(result);
                    }
                    if (l1 !== result.length) {
                        var idx = -1;
                        for (var k = 0; k < result.length; k++) {
                            if (result[k].IsSpecial) {
                                result[k].Index = idx;
                                idx--;
                            }
                        }
                    }
                    return result;
                };
                Controller.prototype.handleAdditionalData = function (additionalData) {
                    if (additionalData != null && additionalData !== undefined) {
                        this.reload(additionalData.ForceServer);
                        if (additionalData.ReloadTableIds && additionalData.ReloadTableIds.length > 0) {
                            for (var i = 0; i < additionalData.ReloadTableIds.length; i++) {
                                if (window['__latticeInstances'][additionalData.ReloadTableIds[i]]) {
                                    window['__latticeInstances'][additionalData.ReloadTableIds[i]].Controller
                                        .reload(additionalData.ForceServer);
                                }
                            }
                        }
                    }
                };
                Controller.prototype.add = function (dataObject) {
                    var added = this._masterTable.DataHolder.add(dataObject);
                    this.reload(false);
                    return added;
                };
                Controller.prototype.remove = function (dataObject) {
                    this._masterTable.DataHolder.remove(dataObject);
                    this.reload(false);
                    return dataObject;
                };
                return Controller;
            }());
            Services.Controller = Controller;
        })(Services = Lattice.Services || (Lattice.Services = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Services;
        (function (Services) {
            var DataHolderService = (function () {
                function DataHolderService(masterTable) {
                    this._orderings = {};
                    this._filters = [];
                    this._anyClientFiltration = false;
                    this._clientValueFunction = {};
                    this._manadatoryOrderings = [];
                    this.DisplayedData = [];
                    this.StoredData = [];
                    this.StoredCache = {};
                    this._conter = 0;
                    this._rawColumnNames = masterTable.InstanceManager.getColumnNames();
                    this._events = masterTable.Events;
                    this._instances = masterTable.InstanceManager;
                    this._masterTable = masterTable;
                    for (var ck in masterTable.InstanceManager.Columns) {
                        var col = masterTable.InstanceManager.Columns[ck];
                        if (col.Configuration.ClientValueFunction != null && col.Configuration.ClientValueFunction != undefined) {
                            this._clientValueFunction[col.RawName] = col.Configuration.ClientValueFunction;
                        }
                    }
                    this._configuration = masterTable.Configuration;
                    this.compileComparisonFunction();
                }
                DataHolderService.prototype.registerClientFilter = function (filter) {
                    this._anyClientFiltration = true;
                    this._filters.push(filter);
                };
                DataHolderService.prototype.getClientFilters = function () {
                    return this._filters;
                };
                DataHolderService.prototype.clearClientFilters = function () {
                    this._anyClientFiltration = false;
                    this._filters = [];
                };
                DataHolderService.prototype.registerClientOrdering = function (dataField, comparator, mandatory, priority) {
                    if (mandatory === void 0) { mandatory = false; }
                    if (priority === void 0) { priority = 0; }
                    this._anyClientFiltration = true;
                    this._orderings[dataField] = {
                        Comparator: comparator,
                        Priority: priority
                    };
                    if (mandatory)
                        this._manadatoryOrderings.push(dataField);
                };
                DataHolderService.prototype.isClientFiltrationPending = function () {
                    return this._anyClientFiltration;
                };
                DataHolderService.prototype.compileKeyFunction = function (keyFields) {
                    if (!window['___ltcstrh']) {
                        window['___ltcstrh'] = function (x) {
                            if (x == null)
                                return '';
                            var r = '';
                            for (var i = 0; i < x.length; i++) {
                                if (x[i] === '\\')
                                    r += '\\\\';
                                else if (x[i] === ':')
                                    r += '\\:';
                                else
                                    r += x[i];
                            }
                            return r;
                        };
                    }
                    var fields = [];
                    for (var i = 0; i < keyFields.length; i++) {
                        var field = keyFields[i];
                        if (this._instances.Columns[keyFields[i]].IsDateTime) {
                            fields.push("((x." + field + ")==null?'':((x." + field + ").getTime()))");
                        }
                        else {
                            if (this._instances.Columns[keyFields[i]].IsBoolean) {
                                fields.push("((x." + field + ")==null?'':(x." + field + "?'1':'0'))");
                            }
                            else if (this._instances.Columns[keyFields[i]].IsString) {
                                fields.push("(window.___ltcstrh(x." + field + "))");
                            }
                            else {
                                fields.push("((x." + field + ")==null?'':(x." + field + ".toString()))");
                            }
                        }
                    }
                    var keyStr = fields.join('+":"+');
                    return eval("(function(x) { return (" + keyStr + ") + ':'; })");
                };
                DataHolderService.prototype.compileComparisonFunction = function () {
                    if ((!this._configuration.KeyFields) || (this._configuration.KeyFields.length === 0)) {
                        this.DataObjectComparisonFunction = (function () {
                            throw Error('You must specify key fields for table row to use current setup. Please call .PrimaryKey on configuration object and specify set of columns exposing primary key.');
                        });
                        this.PrimaryKeyFunction = (function () {
                            throw Error('You must specify key fields for table row to use current setup. Please call .PrimaryKey on configuration object and specify set of columns exposing primary key.');
                        });
                        this._hasPrimaryKey = false;
                        return;
                    }
                    if (this._configuration.KeyFields.length === 0)
                        return;
                    this.DataObjectComparisonFunction = function (x, y) { return x['__key'] === y['__key']; };
                    this.PrimaryKeyFunction = this.compileKeyFunction(this._configuration.KeyFields);
                    this._hasPrimaryKey = true;
                };
                DataHolderService.prototype.deserializeData = function (source) {
                    var data = [];
                    var obj = {};
                    var currentColIndex = this.getNextNonSpecialColumn(-1);
                    var currentCol = this._rawColumnNames[currentColIndex];
                    for (var i = 0; i < source.length; i++) {
                        if (this._instances.Columns[currentCol].IsDateTime) {
                            if (source[i]) {
                                obj[currentCol] = this._masterTable.Date.parse(source[i]);
                            }
                            else {
                                obj[currentCol] = null;
                            }
                        }
                        else {
                            obj[currentCol] = source[i];
                        }
                        currentColIndex = this.getNextNonSpecialColumn(currentColIndex);
                        if (currentColIndex === -1) {
                            currentColIndex = this.getNextNonSpecialColumn(currentColIndex);
                            for (var ck in this._clientValueFunction) {
                                obj[ck] = this._clientValueFunction[ck](obj);
                            }
                            data.push(obj);
                            if (this._hasPrimaryKey) {
                                obj['__key'] = this.PrimaryKeyFunction(obj);
                                if (this._pkDataCache.hasOwnProperty(obj['__key'])) {
                                    obj['__i'] = this._pkDataCache[obj['__key']]['__i'];
                                }
                            }
                            obj = {};
                        }
                        currentCol = this._rawColumnNames[currentColIndex];
                    }
                    return data;
                };
                DataHolderService.prototype.getNextNonSpecialColumn = function (currentColIndex) {
                    do {
                        currentColIndex++;
                        if (currentColIndex >= this._rawColumnNames.length) {
                            return -1;
                        }
                    } while (this._instances.Columns[this._rawColumnNames[currentColIndex]].Configuration.IsSpecial);
                    return currentColIndex;
                };
                DataHolderService.prototype.storeResponse = function (response, clientQuery) {
                    var data = [];
                    var obj = {};
                    var currentColIndex = this.getNextNonSpecialColumn(-1);
                    var currentCol = this._rawColumnNames[currentColIndex];
                    if (!clientQuery.IsBackgroundDataFetch) {
                        this._pkDataCache = {};
                        this.StoredCache = {};
                        this.resetCounter();
                    }
                    for (var i = 0; i < response.Data.length; i++) {
                        if (this._instances.Columns[currentCol].IsDateTime) {
                            if (response.Data[i]) {
                                obj[currentCol] = this._masterTable.Date.parse(response.Data[i]);
                            }
                            else {
                                obj[currentCol] = null;
                            }
                        }
                        else {
                            obj[currentCol] = response.Data[i];
                        }
                        currentColIndex = this.getNextNonSpecialColumn(currentColIndex);
                        if (currentColIndex === -1) {
                            currentColIndex = this.getNextNonSpecialColumn(currentColIndex);
                            for (var ck in this._clientValueFunction) {
                                obj[ck] = this._clientValueFunction[ck](obj);
                            }
                            if (this._hasPrimaryKey) {
                                obj['__key'] = this.PrimaryKeyFunction(obj);
                                if (!this._pkDataCache[obj['__key']]) {
                                    data.push(obj);
                                    this._pkDataCache[obj['__key']] = obj;
                                }
                                else {
                                    throw new Error("Two objects with same primary key " + obj['__key'] + " received. \nTable cannot distinguish two different records with same primary key.\nPlease either remove primary key configuration or pass unique objects.");
                                }
                            }
                            else {
                                data.push(obj);
                            }
                            this.internalKey(obj, true, clientQuery.Partition.Skip);
                            obj = {};
                        }
                        currentCol = this._rawColumnNames[currentColIndex];
                    }
                    if (!clientQuery.IsBackgroundDataFetch)
                        this.StoredData = data;
                    else
                        this.StoredData = this.StoredData.concat(data);
                };
                DataHolderService.prototype.filterSet = function (objects, query) {
                    var result = [];
                    if (this._filters.length !== 0) {
                        var context = {};
                        for (var k = 0; k < this._filters.length; k++) {
                            var flt = this._filters[k];
                            flt.precompute(query, context);
                        }
                        for (var i = 0; i < objects.length; i++) {
                            var obj = objects[i];
                            var acceptable = true;
                            for (var j = 0; j < this._filters.length; j++) {
                                var filter = this._filters[j];
                                acceptable = filter.filterPredicate(obj, context, query);
                                if (!acceptable)
                                    break;
                            }
                            if (!acceptable)
                                continue;
                            result.push(obj);
                        }
                        return result;
                    }
                    return objects;
                };
                DataHolderService.prototype.satisfyCurrentFilters = function (obj) {
                    if (!this.RecentClientQuery)
                        return true;
                    return this.satisfyFilters(obj, this.RecentClientQuery);
                };
                DataHolderService.prototype.satisfyFilters = function (obj, query) {
                    if (this._filters.length === 0)
                        return true;
                    var acceptable = true;
                    var context = {};
                    for (var k = 0; k < this._filters.length; k++) {
                        var flt = this._filters[k];
                        flt.precompute(query, context);
                    }
                    for (var j = 0; j < this._filters.length; j++) {
                        var filter = this._filters[j];
                        acceptable = filter.filterPredicate(obj, context, query);
                        if (!acceptable)
                            break;
                    }
                    return acceptable;
                };
                DataHolderService.prototype.orderWithCurrentOrderings = function (set) {
                    return this.orderSet(set, this.RecentClientQuery);
                };
                DataHolderService.prototype.orderSet = function (objects, query) {
                    if (query.Orderings) {
                        var plan = [];
                        var needsSort = false;
                        for (var i = 0; i < this._rawColumnNames.length; i++) {
                            var orderingKey = this._rawColumnNames[i];
                            if (query.Orderings.hasOwnProperty(orderingKey) || (this._manadatoryOrderings.indexOf(orderingKey) >= 0)) {
                                var orderingDirection = query.Orderings[orderingKey];
                                if (orderingDirection === Lattice.Ordering.Neutral)
                                    continue;
                                if (!this._orderings[orderingKey])
                                    continue;
                                var negate = orderingDirection === Lattice.Ordering.Descending;
                                plan.push({
                                    Comparator: this._orderings[orderingKey].Comparator,
                                    Negate: negate,
                                    Priority: this._orderings[orderingKey].Priority
                                });
                                if (!needsSort) {
                                    needsSort = this._orderings[orderingKey].Priority !== 0;
                                }
                            }
                        }
                        if (plan.length === 0)
                            return objects;
                        if (needsSort) {
                            plan = plan.sort(function (x, y) { return x.Priority - y.Priority; });
                        }
                        var funArray = [];
                        var sortFn = '';
                        var comparersArg = '';
                        for (var j = 0; j < plan.length; j++) {
                            funArray.push(plan[j].Comparator);
                            sortFn += "cc=f" + j + "(a,b); ";
                            comparersArg += "f" + j + ",";
                            sortFn += "if (cc!==0) return " + (plan[j].Negate ? '-cc' : 'cc') + "; ";
                        }
                        comparersArg = comparersArg.substr(0, comparersArg.length - 1);
                        sortFn = "(function(" + comparersArg + "){ return (function (a,b) { var cc = 0; " + sortFn + " return 0; }); })";
                        var sortFunction = eval(sortFn).apply(null, funArray);
                        var ordered = objects.sort(sortFunction);
                        return ordered;
                    }
                    return objects;
                };
                DataHolderService.prototype.filterStoredData = function (query, serverCount) {
                    this._events.ClientDataProcessing.invokeBefore(this, query);
                    this.DisplayedData = this.StoredData;
                    this.Filtered = this.StoredData;
                    this.Ordered = this.StoredData;
                    this.RecentClientQuery = query;
                    if (this.isClientFiltrationPending() && (!(!query))) {
                        var copy = this.StoredData.slice();
                        this._masterTable.Events.Filtered.invokeBefore(this, copy);
                        this.Filtered = this.filterSet(copy, query);
                        this._masterTable.Events.Filtered.invokeAfter(this, this.Filtered);
                        this._masterTable.Events.Ordered.invokeBefore(this, this.Filtered);
                        this.Ordered = this.orderSet(this.Filtered, query);
                        this._masterTable.Events.Ordered.invokeAfter(this, this.Ordered);
                    }
                    this.DisplayedData = this._masterTable.Partition.partitionAfterQuery(this.Ordered, query, serverCount);
                    this._events.ClientDataProcessing.invokeAfter(this, {
                        Displaying: this.DisplayedData,
                        Filtered: this.Filtered,
                        Ordered: this.Ordered,
                        Source: this.StoredData
                    });
                };
                DataHolderService.prototype.filterStoredDataWithPreviousQuery = function () {
                    this.filterStoredData(this.RecentClientQuery, -1);
                };
                DataHolderService.prototype.localLookup = function (predicate, setToLookup) {
                    if (setToLookup === void 0) { setToLookup = this.StoredData; }
                    var result = [];
                    for (var i = 0; i < setToLookup.length; i++) {
                        if (predicate(setToLookup[i])) {
                            result.push({
                                DataObject: setToLookup[i],
                                IsCurrentlyDisplaying: false,
                                LoadedIndex: setToLookup[i]['__i'],
                                DisplayedIndex: -1
                            });
                        }
                    }
                    for (var j = 0; j < result.length; j++) {
                        var idx = this.DisplayedData.indexOf(result[j].DataObject);
                        if (idx >= 0) {
                            result[j].IsCurrentlyDisplaying = true;
                            result[j].DisplayedIndex = idx;
                        }
                    }
                    return result;
                };
                DataHolderService.prototype.localLookupDisplayedDataObject = function (dataObject) {
                    var index = this.DisplayedData.indexOf(dataObject);
                    if (index < 0)
                        return null;
                    var result = {
                        DataObject: dataObject,
                        IsCurrentlyDisplaying: true,
                        DisplayedIndex: index,
                        LoadedIndex: dataObject['__i']
                    };
                    return result;
                };
                DataHolderService.prototype.localLookupStoredDataObject = function (dataObject) {
                    var index = this.StoredData.indexOf(dataObject);
                    if (index < 0)
                        return null;
                    var result = {
                        DataObject: dataObject,
                        IsCurrentlyDisplaying: true,
                        DisplayedIndex: this.DisplayedData.indexOf(dataObject),
                        LoadedIndex: index
                    };
                    return result;
                };
                DataHolderService.prototype.localLookupStoredData = function (index) {
                    if (index < 0)
                        return null;
                    if (index > this.StoredData.length)
                        return null;
                    var result = {
                        DataObject: this.StoredData[index],
                        IsCurrentlyDisplaying: true,
                        DisplayedIndex: this.DisplayedData.indexOf(this.StoredData[index]),
                        LoadedIndex: index
                    };
                    return result;
                };
                DataHolderService.prototype.getByPrimaryKeyObject = function (primaryKeyPart) {
                    return this._pkDataCache[this.PrimaryKeyFunction(primaryKeyPart)];
                };
                DataHolderService.prototype.getByPrimaryKey = function (primaryKey) {
                    return this._pkDataCache[primaryKey];
                };
                DataHolderService.prototype.localLookupPrimaryKey = function (dataObject, setToLookup) {
                    if (setToLookup === void 0) { setToLookup = this.StoredData; }
                    var found = null;
                    var nullResult = {
                        DataObject: null,
                        IsCurrentlyDisplaying: false,
                        DisplayedIndex: -1,
                        LoadedIndex: -1
                    };
                    if (!this._hasPrimaryKey)
                        return nullResult;
                    var pk = this.PrimaryKeyFunction(dataObject);
                    if (!this._pkDataCache.hasOwnProperty(pk))
                        return nullResult;
                    found = this._pkDataCache[pk];
                    var cdisp = this.DisplayedData.indexOf(found);
                    return {
                        DataObject: found,
                        IsCurrentlyDisplaying: cdisp > -1,
                        DisplayedIndex: cdisp,
                        LoadedIndex: found['__i']
                    };
                };
                DataHolderService.prototype.defaultObject = function () {
                    var def = {};
                    for (var i = 0; i < this._rawColumnNames.length; i++) {
                        var col = this._masterTable.InstanceManager.Columns[this._rawColumnNames[i]];
                        if (col.IsInteger || col.IsFloat)
                            def[col.RawName] = 0;
                        if (col.IsBoolean)
                            def[col.RawName] = false;
                        if (col.IsDateTime)
                            def[col.RawName] = new Date();
                        if (col.IsString)
                            def[col.RawName] = '';
                        if (col.IsEnum)
                            def[col.RawName] = 0;
                        if (col.Configuration.IsNullable)
                            def[col.RawName] = null;
                    }
                    for (var ck in this._clientValueFunction) {
                        def[ck] = this._clientValueFunction[ck](def);
                    }
                    if (this._hasPrimaryKey) {
                        def['__key'] = this.PrimaryKeyFunction(def);
                    }
                    this.internalKey(def, false);
                    return def;
                };
                DataHolderService.prototype.add = function (dataObject) {
                    var obj = this.defaultObject();
                    for (var k in this._masterTable.InstanceManager.Columns) {
                        var col = this._masterTable.InstanceManager.Columns[k];
                        if (dataObject[col.RawName] !== undefined) {
                            if (col.Configuration.IsNullable) {
                                obj[col.RawName] = dataObject[col.RawName];
                            }
                            else {
                                if (dataObject[col.RawName] !== null) {
                                    obj[col.RawName] = dataObject[col.RawName];
                                }
                            }
                        }
                    }
                    for (var ck in this._clientValueFunction) {
                        obj[ck] = this._clientValueFunction[ck](obj);
                    }
                    if (this._hasPrimaryKey) {
                        obj['__key'] = this.PrimaryKeyFunction(obj);
                    }
                    this.StoredData.push(obj);
                    this.internalKey(obj);
                    this._pkDataCache[obj['__key']] = obj;
                    return obj;
                };
                DataHolderService.prototype.remove = function (dataObject) {
                    this.detach(dataObject);
                };
                DataHolderService.prototype.detachByKey = function (key) {
                    var obj = this.getByPrimaryKey(key);
                    if (!obj)
                        return;
                    this.detach(obj);
                };
                DataHolderService.prototype.detach = function (dataObject) {
                    if (!dataObject)
                        return;
                    delete this.StoredCache[dataObject['__i']];
                    if (this._hasPrimaryKey)
                        delete this._pkDataCache[dataObject['__key']];
                    var idx = this.StoredData.indexOf(dataObject);
                    if (idx > -1)
                        this.StoredData.splice(idx, 1);
                    idx = this.Filtered.indexOf(dataObject);
                    if (idx > -1)
                        this.Filtered.splice(idx, 1);
                    idx = this.Ordered.indexOf(dataObject);
                    if (idx > -1)
                        this.Ordered.splice(idx, 1);
                    idx = this.DisplayedData.indexOf(dataObject);
                    if (idx > -1)
                        this.DisplayedData.splice(idx, 1);
                    delete dataObject['__i'];
                    delete dataObject['__key'];
                };
                DataHolderService.prototype.copyData = function (source, target) {
                    var modColumns = [];
                    for (var cd in this._instances.Columns) {
                        if (this._instances.Columns[cd].Configuration.IsSpecial)
                            continue;
                        if (source.hasOwnProperty(cd)) {
                            var src = source[cd];
                            var trg = target[cd];
                            if (this._instances.Columns[cd].IsDateTime) {
                                src = (src == null) ? null : src.getTime();
                                trg = (trg == null) ? null : trg.getTime();
                            }
                            if (src !== trg) {
                                modColumns.push(cd);
                                target[cd] = source[cd];
                            }
                        }
                    }
                    return modColumns;
                };
                DataHolderService.prototype.internalKey = function (obj, attach, offset) {
                    if (attach === void 0) { attach = true; }
                    if (offset === void 0) { offset = this._masterTable.Partition.Skip; }
                    if (!obj.hasOwnProperty('__i')) {
                        obj['__i'] = offset + this._conter++;
                        this._conter++;
                    }
                    if (attach)
                        this.StoredCache[obj['__i']] = obj;
                };
                DataHolderService.prototype.resetCounter = function () {
                    this._conter = 0;
                };
                DataHolderService.prototype.proceedAdjustments = function (adjustments) {
                    this._masterTable.Events.Adjustment.invokeBefore(this, adjustments);
                    if (this.RecentClientQuery == null || this.RecentClientQuery == undefined)
                        return null;
                    var needRefilter = false;
                    var redrawVisibles = [];
                    var touchedData = [];
                    var touchedColumns = [];
                    var added = [];
                    var objects = this.deserializeData(adjustments.UpdatedData);
                    for (var i = 0; i < objects.length; i++) {
                        var update = this.getByPrimaryKey(objects[i]['__key']);
                        if (!update) {
                            this.StoredData.push(objects[i]);
                            this.internalKey(objects[i]);
                            added.push(objects[i]);
                            this._pkDataCache[objects[i]['__key']] = objects[i];
                            needRefilter = true;
                        }
                        else {
                            touchedColumns.push(this.copyData(objects[i], update));
                            touchedData.push(update);
                            if (this.DisplayedData.indexOf(update) > -1) {
                                redrawVisibles.push(update);
                            }
                            needRefilter = true;
                        }
                    }
                    for (var j = 0; j < adjustments.RemoveKeys.length; j++) {
                        var dataObject = this.getByPrimaryKey(adjustments.RemoveKeys[j]);
                        if (dataObject == null || dataObject == undefined)
                            continue;
                        this.detach(dataObject);
                        needRefilter = true;
                    }
                    this._masterTable.Selection.handleAdjustments(added, adjustments.RemoveKeys);
                    var adresult = {
                        NeedRefilter: needRefilter,
                        AddedData: added,
                        TouchedData: touchedData,
                        TouchedColumns: touchedColumns,
                        NeedRedrawAll: adjustments.RedrawAll
                    };
                    this._masterTable.Events.Adjustment.invokeAfter(this, adresult);
                    return adresult;
                };
                return DataHolderService;
            }());
            Services.DataHolderService = DataHolderService;
        })(Services = Lattice.Services || (Lattice.Services = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Services;
        (function (Services) {
            var DateService = (function () {
                function DateService(datepickerOptions) {
                    this._datepickerOptions = datepickerOptions;
                }
                DateService.prototype.ensureDpo = function () {
                    if (this._datepickerOptions == null || this._datepickerOptions == undefined) {
                        throw new Error('For this functionality you need 3rd-party datepicker. Please connect one using .Datepicker method');
                    }
                };
                DateService.prototype.isValidDate = function (date) {
                    if (date === null)
                        return true;
                    if (date == undefined)
                        return false;
                    if (Object.prototype.toString.call(date) === "[object Date]") {
                        if (isNaN(date.getTime()))
                            return false;
                        else
                            return true;
                    }
                    return false;
                };
                DateService.prototype.serialize = function (date) {
                    if (date === null || date == undefined)
                        return '';
                    if (Object.prototype.toString.call(date) === "[object Date]") {
                        if (isNaN(date.getTime()))
                            return '';
                        var offset = 0 - date.getTimezoneOffset();
                        var r = date.getFullYear() +
                            '-' + DateService.pad(date.getMonth() + 1) +
                            '-' + DateService.pad(date.getDate()) +
                            'T' + DateService.pad(date.getHours()) +
                            ':' + DateService.pad(date.getMinutes()) +
                            ':' + DateService.pad(date.getSeconds()) +
                            '.' + (date.getMilliseconds() / 1000).toFixed(3).slice(2, 5)
                            + (offset < 0 ? "-" : "+")
                            + DateService.pad(parseInt((Math.abs(offset) / 60).toString())) +
                            ':' + DateService.pad(offset % 60);
                        return r;
                    }
                    else
                        throw new Error(date + " is not a date at all");
                };
                DateService.pad = function (x) {
                    if (x < 10) {
                        return '0' + x;
                    }
                    return x.toString();
                };
                DateService.prototype.parse = function (dateString) {
                    var date = new Date(dateString);
                    if (Object.prototype.toString.call(date) === "[object Date]") {
                        if (isNaN(date.getTime()))
                            return null;
                        else
                            return date;
                    }
                    throw new Error(dateString + " is not a date at all");
                };
                DateService.prototype.getDateFromDatePicker = function (element) {
                    this.ensureDpo();
                    if (element == null || element == undefined)
                        return null;
                    var date = this._datepickerOptions.GetFromDatePicker(element);
                    if (date == null)
                        return null;
                    if (Object.prototype.toString.call(date) === "[object Date]") {
                        if (isNaN(date.getTime()))
                            return null;
                        else
                            return date;
                    }
                    throw new Error(date + " from datepicker is not a date at all");
                };
                DateService.prototype.createDatePicker = function (element, isNullableDate) {
                    this.ensureDpo();
                    if (element == null || element == undefined)
                        return;
                    if (!isNullableDate)
                        isNullableDate = false;
                    this._datepickerOptions.CreateDatePicker(element, isNullableDate);
                };
                DateService.prototype.destroyDatePicker = function (element) {
                    this.ensureDpo();
                    if (element == null || element == undefined)
                        return;
                    this._datepickerOptions.DestroyDatepicker(element);
                };
                DateService.prototype.putDateToDatePicker = function (element, date) {
                    this.ensureDpo();
                    if (element == null || element == undefined)
                        return;
                    this._datepickerOptions.PutToDatePicker(element, date);
                };
                return DateService;
            }());
            Services.DateService = DateService;
        })(Services = Lattice.Services || (Lattice.Services = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
if (!Date.prototype.toISOString) {
    (function () {
        function pad(number) {
            if (number < 10) {
                return '0' + number;
            }
            return number;
        }
        Date.prototype.toISOString = function () {
            return this.getUTCFullYear() +
                '-' + pad(this.getUTCMonth() + 1) +
                '-' + pad(this.getUTCDate()) +
                'T' + pad(this.getUTCHours()) +
                ':' + pad(this.getUTCMinutes()) +
                ':' + pad(this.getUTCSeconds()) +
                '.' + (this.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) +
                'Z';
        };
    }());
}
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Services;
        (function (Services) {
            var InstanceManagerService = (function () {
                function InstanceManagerService(configuration, masterTable, events) {
                    this.Columns = {};
                    this.Plugins = {};
                    this._rawColumnNames = [];
                    this._configuration = configuration;
                    this._masterTable = masterTable;
                    this._events = events;
                    this._isHandlingSpecialPlacementCase = !(!this._configuration.EmptyFiltersPlaceholder);
                    this._specialCasePlaceholder = this._configuration.EmptyFiltersPlaceholder;
                    this.initColumns();
                }
                InstanceManagerService.classifyType = function (fieldType) {
                    return {
                        IsDateTime: this._datetimeTypes.indexOf(fieldType) > -1,
                        IsString: this._stringTypes.indexOf(fieldType) > -1,
                        IsFloat: this._floatTypes.indexOf(fieldType) > -1,
                        IsInteger: this._integerTypes.indexOf(fieldType) > -1,
                        IsBoolean: this._booleanTypes.indexOf(fieldType) > -1,
                        IsNullable: this.endsWith(fieldType, '?')
                    };
                };
                InstanceManagerService.prototype.initColumns = function () {
                    var columns = [];
                    for (var i = 0; i < this._configuration.Columns.length; i++) {
                        var cnf = this._configuration.Columns[i];
                        var c = InstanceManagerService.createColumn(cnf, this._masterTable, i);
                        this.Columns[c.RawName] = c;
                        columns.push(c);
                    }
                    columns = columns.sort(function (a, b) { return a.Order - b.Order; });
                    for (var j = 0; j < columns.length; j++) {
                        this._rawColumnNames.push(columns[j].RawName);
                    }
                };
                InstanceManagerService.createColumn = function (cnf, masterTable, order) {
                    var c = {
                        Configuration: cnf,
                        RawName: cnf.RawColumnName,
                        MasterTable: masterTable,
                        Header: null,
                        Order: order == null ? 0 : order,
                        IsDateTime: InstanceManagerService._datetimeTypes.indexOf(cnf.ColumnType) > -1,
                        IsString: InstanceManagerService._stringTypes.indexOf(cnf.ColumnType) > -1,
                        IsFloat: InstanceManagerService._floatTypes.indexOf(cnf.ColumnType) > -1,
                        IsInteger: InstanceManagerService._integerTypes.indexOf(cnf.ColumnType) > -1,
                        IsBoolean: InstanceManagerService._booleanTypes.indexOf(cnf.ColumnType) > -1,
                        IsEnum: cnf.IsEnum,
                        UiOrder: 0
                    };
                    c.Header = {
                        Column: c,
                        renderContent: null,
                        renderElement: null
                    };
                    return c;
                };
                InstanceManagerService.prototype.initPlugins = function () {
                    var pluginsConfiguration = this._configuration.PluginsConfiguration;
                    var specialCases = {};
                    var anySpecialCases = false;
                    Lattice.ComponentsContainer.registerAllEvents(this._events, this._masterTable);
                    for (var l = 0; l < pluginsConfiguration.length; l++) {
                        var conf = pluginsConfiguration[l];
                        var plugin = Lattice.ComponentsContainer.resolveComponent(conf.PluginId);
                        plugin.PluginLocation = (!conf.Placement) ? conf.PluginId : conf.Placement + "-" + conf.PluginId;
                        plugin.RawConfig = conf;
                        plugin.Order = conf.Order || 0;
                        plugin.init(this._masterTable);
                        if (this._isHandlingSpecialPlacementCase && InstanceManagerService.startsWith(conf.Placement, this._specialCasePlaceholder)) {
                            specialCases[conf.Placement + '-'] = plugin;
                            anySpecialCases = true;
                        }
                        else {
                            this.Plugins[plugin.PluginLocation] = plugin;
                        }
                    }
                    this._events.ColumnsCreation.invokeBefore(this, this.Columns);
                    if (this._isHandlingSpecialPlacementCase) {
                        if (anySpecialCases) {
                            var columns = this.getUiColumnNames();
                            for (var i = 0; i < columns.length; i++) {
                                var c = columns[i];
                                var id = this._specialCasePlaceholder + "-" + c + "-";
                                var specialPlugin = null;
                                for (var k in specialCases) {
                                    if (InstanceManagerService.startsWith(k, id)) {
                                        specialPlugin = specialCases[k];
                                    }
                                }
                                if (specialPlugin == null) {
                                    specialPlugin = {
                                        PluginLocation: id + "-empty",
                                        renderContent: function () { return ''; },
                                        Order: 0,
                                        RawConfig: null,
                                        renderElement: null,
                                        init: null
                                    };
                                }
                                specialPlugin.Order = i;
                                this.Plugins[specialPlugin.PluginLocation] = specialPlugin;
                            }
                        }
                    }
                    this._events.ColumnsCreation.invokeAfter(this, this.Columns);
                };
                InstanceManagerService.startsWith = function (s1, prefix) {
                    if (s1 == undefined || s1 === null)
                        return false;
                    if (prefix.length > s1.length)
                        return false;
                    if (s1 === prefix)
                        return true;
                    var part = s1.substring(0, prefix.length);
                    return part === prefix;
                };
                InstanceManagerService.endsWith = function (s1, postfix) {
                    if (s1 == undefined || s1 === null)
                        return false;
                    if (postfix.length > s1.length)
                        return false;
                    if (s1 === postfix)
                        return true;
                    var part = s1.substring(s1.length - postfix.length - 1, postfix.length);
                    return part === postfix;
                };
                InstanceManagerService.prototype._subscribeConfiguredEvents = function () {
                    var delegator = this._masterTable.Renderer.Delegator;
                    for (var i = 0; i < this._configuration.Subscriptions.length; i++) {
                        var sub = this._configuration.Subscriptions[i];
                        if (sub.IsRowSubscription) {
                            var h = (function (hndlr) {
                                return function (e) {
                                    hndlr(e);
                                };
                            })(sub.Handler);
                            for (var j = 0; j < sub.DomEvent.DomEvents.length; j++) {
                                delegator.subscribeRowEvent({
                                    EventId: sub.DomEvent.DomEvents[j],
                                    Selector: sub.Selector,
                                    Handler: h,
                                    SubscriptionId: 'configured-row-' + i,
                                    filter: sub.DomEvent.Predicate
                                });
                            }
                        }
                        else {
                            var h2 = (sub.ColumnName == null) ? sub.Handler :
                                (function (hndlr, im, colName) {
                                    return function (e) {
                                        if (im.getColumnNames().indexOf(colName) !== e.Column)
                                            return;
                                        hndlr(e);
                                    };
                                })(sub.Handler, this._masterTable.InstanceManager, sub.ColumnName);
                            for (var k = 0; k < sub.DomEvent.DomEvents.length; k++) {
                                delegator.subscribeCellEvent({
                                    EventId: sub.DomEvent.DomEvents[k],
                                    Selector: sub.Selector,
                                    Handler: h2,
                                    SubscriptionId: 'configured-cell-' + i,
                                    filter: sub.DomEvent.Predicate
                                });
                            }
                        }
                    }
                };
                InstanceManagerService.prototype.getPlugin = function (pluginId, placement) {
                    if (!placement)
                        placement = '';
                    var key = placement.length === 0 ? pluginId : placement + "-" + pluginId;
                    if (this.Plugins[key])
                        return (this.Plugins[key]);
                    else {
                        for (var k in this.Plugins) {
                            if (this.Plugins.hasOwnProperty(k)) {
                                var plg = this.Plugins[k];
                                if (InstanceManagerService.startsWith(plg.RawConfig.PluginId, pluginId))
                                    return plg;
                            }
                        }
                    }
                    throw new Error("There is no plugin " + pluginId + " on place " + placement);
                };
                InstanceManagerService.prototype.getPlugins = function (placement) {
                    var result = [];
                    if (!InstanceManagerService.endsWith(placement, "-"))
                        placement += "-";
                    for (var k in this.Plugins) {
                        if (this.Plugins.hasOwnProperty(k)) {
                            var kp = (k + "-").substring(0, placement.length);
                            if (kp === placement) {
                                result.push(this.Plugins[k]);
                            }
                        }
                    }
                    result = result.sort(function (a, b) {
                        return a.Order - b.Order;
                    });
                    return result;
                };
                InstanceManagerService.prototype.getColumnFilter = function (columnName) {
                    var filterId = "filter-" + columnName;
                    for (var k in this.Plugins) {
                        if (this.Plugins.hasOwnProperty(k)) {
                            var kp = k.substring(0, filterId.length);
                            if (kp === filterId)
                                return this.Plugins[k];
                        }
                    }
                    throw new Error("There is no filter for " + columnName);
                };
                InstanceManagerService.prototype.getColumnNames = function () {
                    return this._rawColumnNames;
                };
                InstanceManagerService.prototype.getUiColumnNames = function () {
                    var result = [];
                    var uiCol = this.getUiColumns();
                    for (var i = 0; i < uiCol.length; i++) {
                        result.push(uiCol[i].RawName);
                    }
                    return result;
                };
                InstanceManagerService.prototype.getUiColumns = function () {
                    var result = [];
                    for (var ck in this.Columns) {
                        if (this.Columns.hasOwnProperty(ck)) {
                            var col = this.Columns[ck];
                            if (col.Configuration.IsDataOnly)
                                continue;
                            result.push(col);
                        }
                    }
                    result = result.sort(function (a, b) { return a.Configuration.DisplayOrder - b.Configuration.DisplayOrder; });
                    for (var i = 0; i < result.length; i++) {
                        result[i].UiOrder = i;
                    }
                    return result;
                };
                InstanceManagerService.prototype.getColumn = function (columnName) {
                    if (!this.Columns.hasOwnProperty(columnName))
                        throw new Error("Column " + columnName + " not found for rendering");
                    return this.Columns[columnName];
                };
                InstanceManagerService.prototype.getColumnByOrder = function (columnOrder) {
                    return this.Columns[this._rawColumnNames[columnOrder]];
                };
                InstanceManagerService._datetimeTypes = ['DateTime', 'DateTime?'];
                InstanceManagerService._stringTypes = ['String'];
                InstanceManagerService._floatTypes = ['Single', 'Double', 'Decimal', 'Single?', 'Double?', 'Decimal?'];
                InstanceManagerService._integerTypes = ['Int32', 'Int64', 'Int16', 'SByte', 'Byte', 'UInt32', 'UInt64', 'UInt16', 'Int32?', 'Int64?', 'Int16?', 'SByte?', 'Byte?', 'UInt32?', 'UInt64?', 'UInt16?'];
                InstanceManagerService._booleanTypes = ['Boolean', 'Boolean?'];
                return InstanceManagerService;
            }());
            Services.InstanceManagerService = InstanceManagerService;
        })(Services = Lattice.Services || (Lattice.Services = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Services;
        (function (Services) {
            var LoaderService = (function () {
                function LoaderService(staticData, masterTable) {
                    this._queryPartProviders = [];
                    this._additionalDataReceivers = {};
                    this._isFirstTimeLoading = false;
                    this._runningBackgroundRequests = [];
                    this._isLoading = false;
                    this._staticData = staticData;
                    this._masterTable = masterTable;
                    this._events = this._masterTable.Events;
                    this._dataHolder = this._masterTable.DataHolder;
                }
                LoaderService.prototype.registerQueryPartProvider = function (provider) {
                    this._queryPartProviders.push(provider);
                };
                LoaderService.prototype.registerAdditionalDataReceiver = function (dataKey, receiver) {
                    if (!this._additionalDataReceivers[dataKey]) {
                        this._additionalDataReceivers[dataKey] = [];
                    }
                    this._additionalDataReceivers[dataKey].push(receiver);
                };
                LoaderService.prototype.prefetchData = function (data) {
                    var clientQuery = this.gatherQuery(Lattice.QueryScope.Client);
                    var serverQuery = this.gatherQuery(Lattice.QueryScope.Server);
                    this._masterTable.Partition.partitionBeforeQuery(serverQuery, clientQuery, false);
                    var arg = {
                        Data: {
                            Data: data,
                            AdditionalData: null,
                            Success: true,
                            BatchSize: 0,
                            Message: null,
                            PageIndex: 0,
                            ResultsCount: 0
                        },
                        Request: null,
                        XMLHttp: null,
                        IsAdjustment: false
                    };
                    this._masterTable.Events.DataReceived.invokeBefore(this, arg);
                    this._dataHolder.storeResponse({
                        Data: data
                    }, clientQuery);
                    this._dataHolder.filterStoredDataWithPreviousQuery();
                    this._previousQueryString = JSON.stringify(clientQuery);
                    this._masterTable.Events.DataReceived.invokeAfter(this, arg);
                };
                LoaderService.prototype.gatherQuery = function (queryScope) {
                    var a = {
                        Orderings: {},
                        Filterings: {},
                        AdditionalData: {},
                        StaticDataJson: this._masterTable.Configuration.StaticData,
                        Selection: null,
                        IsBackgroundDataFetch: false,
                        Partition: null
                    };
                    if (queryScope === Lattice.QueryScope.Client) {
                        this._events.ClientQueryGathering.invokeBefore(this, { Query: a, Scope: queryScope });
                    }
                    else {
                        this._events.QueryGathering.invokeBefore(this, { Query: a, Scope: queryScope });
                    }
                    for (var i = 0; i < this._queryPartProviders.length; i++) {
                        this._queryPartProviders[i].modifyQuery(a, queryScope);
                    }
                    if (queryScope === Lattice.QueryScope.Client) {
                        this._events.ClientQueryGathering.invokeAfter(this, { Query: a, Scope: queryScope });
                    }
                    else {
                        this._events.QueryGathering.invokeAfter(this, { Query: a, Scope: queryScope });
                    }
                    return a;
                };
                LoaderService.prototype.createXmlHttp = function () {
                    var xmlhttp;
                    try {
                        xmlhttp = new ActiveXObject('Msxml2.XMLHTTP');
                    }
                    catch (e) {
                        try {
                            xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
                        }
                        catch (E) {
                            xmlhttp = false;
                        }
                    }
                    if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
                        xmlhttp = new XMLHttpRequest();
                    }
                    return xmlhttp;
                };
                LoaderService.prototype.cancelBackground = function () {
                    for (var i = 0; i < this._runningBackgroundRequests.length; i++) {
                        this._runningBackgroundRequests[i].abort();
                    }
                    this._runningBackgroundRequests = [];
                };
                LoaderService.prototype.getXmlHttp = function (backgroupd) {
                    if (!backgroupd) {
                        if (this._previousRequest) {
                            this._previousRequest.abort();
                            this._previousRequest = null;
                            this.cancelBackground();
                        }
                    }
                    var req = this.createXmlHttp();
                    req.open('POST', this._masterTable.Configuration.OperationalAjaxUrl, true);
                    req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                    req.setRequestHeader('Content-type', 'application/json');
                    if (!backgroupd)
                        this._previousRequest = req;
                    else
                        this._runningBackgroundRequests.push(req);
                    return req;
                };
                LoaderService.prototype.checkError = function (json, data) {
                    if (json == null)
                        return false;
                    if (json['__ZBnpwvibZm'] && json['Success'] != undefined && !json.Success) {
                        if (json['Message'] && json['Message'].Class === 'error' && json['Message'].Type !== Lattice.MessageType.UserMessage) {
                            json['Message'].Class = this._masterTable.Configuration.CoreTemplates.ErrorMessage;
                        }
                        this._masterTable.MessageService.showMessage(json['Message']);
                        this._events.LoadingError.invoke(this, {
                            Request: data,
                            Reason: json.Message
                        });
                        return true;
                    }
                    return false;
                };
                LoaderService.prototype.checkMessage = function (json) {
                    if (json == null)
                        return false;
                    if (json.Message && json.Message['__Go7XIV13OA']) {
                        if (json.Message.Class === 'error' && json.Message.Type !== Lattice.MessageType.UserMessage) {
                            json.Message.Class = this._masterTable.Configuration.CoreTemplates.ErrorMessage;
                        }
                        var msg = json.Message;
                        this._masterTable.MessageService.showMessage(msg);
                        if (msg.Type === Lattice.MessageType.Banner)
                            return true;
                        return false;
                    }
                    return false;
                };
                LoaderService.prototype.checkAdditionalData = function (json) {
                    if (json == null)
                        return;
                    if (json.AdditionalData && json.AdditionalData['__TxQeah2p']) {
                        var data = json.AdditionalData['Data'];
                        for (var adk in data) {
                            if (!this._additionalDataReceivers[adk])
                                continue;
                            var receivers = this._additionalDataReceivers[adk];
                            for (var i = 0; i < receivers.length; i++) {
                                receivers[i].handleAdditionalData(data[adk]);
                            }
                        }
                    }
                };
                LoaderService.prototype.checkAdjustment = function (json, data) {
                    if (json == null)
                        return false;
                    if (json['__XqTFFhTxSu']) {
                        this._events.DataReceived.invokeBefore(this, {
                            Request: data,
                            Data: json,
                            IsAdjustment: true
                        });
                        this._masterTable.proceedAdjustments(json);
                        for (var otherAdj in json.OtherTablesAdjustments) {
                            if (json.OtherTablesAdjustments.hasOwnProperty(otherAdj)) {
                                if (window['__latticeInstances'][otherAdj]) {
                                    window['__latticeInstances'][otherAdj].proceedAdjustments(json.OtherTablesAdjustments[otherAdj]);
                                }
                            }
                        }
                        this._events.DataReceived.invokeAfter(this, {
                            Request: data,
                            Data: json,
                            IsAdjustment: true
                        });
                        return true;
                    }
                    return false;
                };
                LoaderService.prototype.handleRegularJsonResponse = function (responseText, data, clientQuery, callback, errorCallback) {
                    var response = JSON.parse(responseText);
                    var error = this.checkError(response, data);
                    var message = this.checkMessage(response);
                    if (message) {
                        this.checkAdditionalData(response);
                        callback(response);
                        return;
                    }
                    var edit = this.checkAdjustment(response, data);
                    if (edit) {
                        this.checkAdditionalData(response);
                        callback(response);
                        return;
                    }
                    if (!error) {
                        if (data.Command === 'query') {
                            this._events.DataReceived.invokeBefore(this, {
                                Request: data,
                                Data: response,
                                IsAdjustment: false
                            });
                            this._dataHolder.storeResponse(response, clientQuery);
                            this._events.DataReceived.invokeAfter(this, {
                                Request: data,
                                Data: response,
                                IsAdjustment: false
                            });
                            this._dataHolder.filterStoredData(clientQuery, response.ResultsCount);
                            this.checkAdditionalData(response);
                            callback(response);
                            data.Query.Selection = null;
                            data.Query.Partition = null;
                            if (!data.Query.IsBackgroundDataFetch) {
                                this._previousQueryString = JSON.stringify(data.Query);
                            }
                        }
                        else {
                            this.checkAdditionalData(response);
                            callback(response);
                        }
                    }
                    else {
                        this.checkAdditionalData(response);
                        if (errorCallback)
                            errorCallback(response);
                    }
                };
                LoaderService.prototype.handleDeferredResponse = function (responseText, data, callback) {
                    if (responseText.indexOf('$Token=') === 0) {
                        var token = responseText.substr(7, responseText.length - 7);
                        var deferredUrl = this._masterTable.Configuration.OperationalAjaxUrl + (this._masterTable.Configuration.OperationalAjaxUrl.indexOf('?') > -1 ? '&' : '?') + 'q=' + token;
                        this._events.DeferredDataReceived.invoke(this, {
                            Request: data,
                            Token: token,
                            DataUrl: deferredUrl
                        });
                        callback({
                            $isDeferred: true,
                            $url: deferredUrl,
                            $token: token
                        });
                    }
                };
                LoaderService.prototype.isLoading = function () {
                    return this._isLoading;
                };
                LoaderService.prototype.doServerQuery = function (data, clientQuery, callback, errorCallback) {
                    var _this = this;
                    this._isLoading = true;
                    var req = this.getXmlHttp(data.Query.IsBackgroundDataFetch);
                    var dataText = JSON.stringify(data);
                    this._events.Loading.invokeBefore(this, { Request: data, XMLHttp: req });
                    var reqEvent = req.onload ? 'onload' : 'onreadystatechange';
                    req[reqEvent] = (function () {
                        if (req.readyState !== 4)
                            return false;
                        if (req.status === 200) {
                            var ctype = req.getResponseHeader('content-type');
                            if (ctype)
                                ctype = ctype.toLowerCase();
                            if (ctype && ctype.indexOf('application/json') >= 0) {
                                _this.handleRegularJsonResponse(req.responseText, data, clientQuery, callback, errorCallback);
                            }
                            else if (ctype && ctype.indexOf('lattice/service') >= 0) {
                                _this.handleDeferredResponse(req.responseText, data, callback);
                            }
                            else {
                                if (callback)
                                    callback(req.responseText);
                            }
                        }
                        else {
                            if (req.status === 0)
                                return false;
                            _this._events.LoadingError.invoke(_this, {
                                Request: data,
                                XMLHttp: req,
                                Reason: 'Network error'
                            });
                            if (errorCallback)
                                errorCallback(req.responseText);
                        }
                        _this._isLoading = false;
                        _this._events.Loading.invokeAfter(_this, {
                            Request: data,
                            XMLHttp: req
                        });
                    });
                    req.send(dataText);
                };
                LoaderService.prototype.query = function (callback, queryModifier, errorCallback, force) {
                    var _this = this;
                    var serverQuery = this.gatherQuery(Lattice.QueryScope.Server);
                    var clientQuery = this.gatherQuery(Lattice.QueryScope.Client);
                    if (queryModifier) {
                        queryModifier(serverQuery);
                        queryModifier(clientQuery);
                    }
                    var queriesEqual = (JSON.stringify(serverQuery) === this._previousQueryString);
                    var server = force || !queriesEqual;
                    server = this._masterTable.Partition.partitionBeforeQuery(serverQuery, clientQuery, server);
                    this._masterTable.Selection.modifyQuery(serverQuery, Lattice.QueryScope.Server);
                    var data = {
                        Command: 'query',
                        Query: server ? serverQuery : clientQuery
                    };
                    if (this._masterTable.Configuration.QueryConfirmation) {
                        this._masterTable.Configuration.QueryConfirmation(data, server ? Lattice.QueryScope.Server : Lattice.QueryScope.Client, function () {
                            if (server)
                                _this.doServerQuery(data, clientQuery, callback, errorCallback);
                            else
                                _this.doClientQuery(clientQuery, callback);
                        });
                    }
                    else {
                        if (server)
                            this.doServerQuery(data, clientQuery, callback, errorCallback);
                        else
                            this.doClientQuery(clientQuery, callback);
                    }
                };
                LoaderService.prototype.doClientQuery = function (clientQuery, callback) {
                    this._isLoading = true;
                    this._dataHolder.filterStoredData(clientQuery, -1);
                    callback(null);
                    this._isLoading = false;
                };
                LoaderService.prototype.command = function (command, callback, queryModifier, errorCallback, force) {
                    var _this = this;
                    if (command === 'query') {
                        this.query(callback, queryModifier, errorCallback, force);
                        return;
                    }
                    var serverQuery = this.gatherQuery(Lattice.QueryScope.Transboundary);
                    if (queryModifier) {
                        queryModifier(serverQuery);
                    }
                    this._masterTable.Selection.modifyQuery(serverQuery, Lattice.QueryScope.Transboundary);
                    var data = {
                        Command: command,
                        Query: serverQuery
                    };
                    if (this._masterTable.Configuration.QueryConfirmation) {
                        this._masterTable.Configuration.QueryConfirmation(data, Lattice.QueryScope.Transboundary, function () { return _this.doServerQuery(data, null, callback, errorCallback); });
                    }
                    else {
                        this.doServerQuery(data, null, callback, errorCallback);
                    }
                };
                return LoaderService;
            }());
            Services.LoaderService = LoaderService;
        })(Services = Lattice.Services || (Lattice.Services = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Services;
        (function (Services) {
            var MessagesService = (function () {
                function MessagesService(usersMessageFn, instances, controller, templatesProvider, coreTemplates) {
                    this._noresultsOverrideRow = null;
                    this._usersMessageFn = usersMessageFn;
                    this._instances = instances;
                    this._controller = controller;
                    this._templatesProvider = templatesProvider;
                    if (!usersMessageFn) {
                        this._usersMessageFn = function (m) { alert(m.Title + '\r\n' + m.Details); };
                    }
                    this._controller.registerAdditionalRowsProvider(this);
                    this._coreTemplate = coreTemplates;
                }
                MessagesService.prototype.showMessage = function (message) {
                    if (message.Type === Lattice.MessageType.UserMessage) {
                        this._usersMessageFn(message);
                    }
                    else {
                        this.showTableMessage(message);
                    }
                };
                MessagesService.prototype.showTableMessage = function (tableMessage) {
                    if (!this._templatesProvider.Executor.hasTemplate("ltmsg-" + tableMessage.Class)) {
                        this._controller.replaceVisibleData([]);
                        return;
                    }
                    var msgRow = {
                        DataObject: tableMessage,
                        IsSpecial: true,
                        TemplateIdOverride: "ltmsg-" + tableMessage.Class,
                        MasterTable: null,
                        Index: 0,
                        Cells: {},
                        Command: null,
                        DisplayIndex: 0,
                        IsLast: true
                    };
                    tableMessage.UiColumnsCount = this._instances.getUiColumns().length;
                    tableMessage.IsMessageObject = true;
                    this._controller.replaceVisibleData([msgRow]);
                };
                MessagesService.prototype.overrideNoresults = function (row) {
                    this._noresultsOverrideRow = row;
                };
                MessagesService.prototype.provide = function (rows) {
                    if (rows.length === 0) {
                        if (this._noresultsOverrideRow != null) {
                            rows.push(this._noresultsOverrideRow);
                            return;
                        }
                        var message = {
                            Class: this._coreTemplate.NoResultsMessage,
                            Title: 'No data found',
                            Details: 'Try specifying different filter settings',
                            Type: Lattice.MessageType.Banner,
                            UiColumnsCount: this._instances.getUiColumns().length,
                            IsMessageObject: true
                        };
                        var msgRow = {
                            DataObject: message,
                            IsSpecial: true,
                            TemplateIdOverride: "ltmsg-" + message.Class,
                            MasterTable: null,
                            Index: 0,
                            Cells: {},
                            Command: null,
                            DisplayIndex: 0,
                            IsLast: true
                        };
                        rows.push(msgRow);
                    }
                };
                return MessagesService;
            }());
            Services.MessagesService = MessagesService;
        })(Services = Lattice.Services || (Lattice.Services = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Services;
        (function (Services) {
            var SelectionService = (function () {
                function SelectionService(masterTable) {
                    var _this = this;
                    this._selectionData = {};
                    this._masterTable = masterTable;
                    this._configuration = this._masterTable.Configuration.SelectionConfiguration;
                    if (this._configuration.SelectSingle) {
                        this._configuration.SelectAllBehavior = Reinforced.Lattice.SelectAllBehavior.Disabled;
                    }
                    if (this._configuration.ResetSelectionBehavior ===
                        Reinforced.Lattice.ResetSelectionBehavior.ClientReload) {
                        masterTable.Events.ClientDataProcessing.subscribeAfter(function (x) { return _this.resetSelection(); }, 'selection');
                    }
                    if (this._configuration.ResetSelectionBehavior ===
                        Reinforced.Lattice.ResetSelectionBehavior.ServerReload) {
                        masterTable.Events.DataReceived.subscribeBefore(function (x) {
                            if (x.EventArgs.Request.Command === 'query')
                                _this.resetSelection();
                        }, 'selection');
                    }
                    masterTable.Loader.registerAdditionalDataReceiver('Selection', this);
                }
                SelectionService.prototype.isSelected = function (dataObject) {
                    return this.isSelectedPrimaryKey(dataObject['__key']);
                };
                SelectionService.prototype.isAllSelected = function () {
                    if (this._masterTable.DataHolder.DisplayedData.length === 0)
                        return false;
                    for (var i = 0; i < this._masterTable.DataHolder.DisplayedData.length; i++) {
                        if (this.canSelect(this._masterTable.DataHolder.DisplayedData[i])) {
                            if (!this._selectionData.hasOwnProperty(this._masterTable.DataHolder.DisplayedData[i]['__key']))
                                return false;
                        }
                    }
                    return true;
                };
                SelectionService.prototype.canSelect = function (dataObject) {
                    if (this._configuration.CanSelectRowFunction == null)
                        return true;
                    return this._configuration.CanSelectRowFunction(dataObject);
                };
                SelectionService.prototype.canSelectAll = function () {
                    if (this._masterTable.DataHolder.DisplayedData.length === 0)
                        return false;
                    if (this._configuration.SelectAllBehavior === Reinforced.Lattice.SelectAllBehavior.Disabled) {
                        return false;
                    }
                    if (this._configuration.SelectAllBehavior === Reinforced.Lattice.SelectAllBehavior.OnlyIfAllDataVisible) {
                        return this._masterTable.DataHolder.StoredData.length === this._masterTable.DataHolder.DisplayedData.length;
                    }
                    return true;
                };
                SelectionService.prototype.resetSelection = function () {
                    this._masterTable.Events.SelectionChanged.invokeBefore(this, this._selectionData);
                    var objectsToRedraw = [];
                    for (var k in this._selectionData) {
                        var sd = this._selectionData[k];
                        var obj = this._masterTable.DataHolder.getByPrimaryKey(k);
                        if (this._masterTable.DataHolder.DisplayedData.indexOf(obj) >= 0)
                            objectsToRedraw.push(obj);
                        delete this._selectionData[k];
                    }
                    if (objectsToRedraw.length > this._masterTable.DataHolder.DisplayedData.length / 2) {
                        this._masterTable.Controller.redrawVisibleData();
                    }
                    else {
                        for (var j = 0; j < objectsToRedraw.length; j++) {
                            this._masterTable.Controller.redrawVisibleDataObject(objectsToRedraw[j]);
                        }
                    }
                    this._masterTable.Events.SelectionChanged.invokeAfter(this, this._selectionData);
                };
                SelectionService.prototype.toggleAll = function (selected) {
                    if (this._configuration.SelectAllBehavior === Reinforced.Lattice.SelectAllBehavior.Disabled) {
                        return;
                    }
                    if (this._configuration.SelectAllBehavior === Reinforced.Lattice.SelectAllBehavior.OnlyIfAllDataVisible) {
                        if (this._masterTable.DataHolder.StoredData.length !==
                            this._masterTable.DataHolder.DisplayedData.length)
                            return;
                    }
                    this._masterTable.Events.SelectionChanged.invokeBefore(this, this._selectionData);
                    if (selected == null) {
                        selected = !this.isAllSelected();
                    }
                    var redrawAll = false;
                    var objectsToRedraw = [];
                    var objSet = null;
                    if (this._configuration.SelectAllBehavior === Reinforced.Lattice.SelectAllBehavior.AllVisible ||
                        this._configuration.SelectAllBehavior ===
                            Reinforced.Lattice.SelectAllBehavior.OnlyIfAllDataVisible) {
                        objSet = this._masterTable.DataHolder.DisplayedData;
                    }
                    else {
                        objSet = this._masterTable.DataHolder.StoredData;
                    }
                    if (selected) {
                        for (var i = 0; i < objSet.length; i++) {
                            var sd = objSet[i];
                            if (this.canSelect(sd)) {
                                if (!this._selectionData.hasOwnProperty(sd["__key"])) {
                                    objectsToRedraw.push(sd);
                                    this._selectionData[sd["__key"]] = [];
                                }
                            }
                        }
                    }
                    else {
                        for (var i = 0; i < objSet.length; i++) {
                            var sd = objSet[i];
                            if (this.canSelect(sd)) {
                                if (this._selectionData.hasOwnProperty(sd["__key"])) {
                                    objectsToRedraw.push(sd);
                                    delete this._selectionData[sd["__key"]];
                                }
                            }
                        }
                    }
                    if (objectsToRedraw.length > this._masterTable.DataHolder.DisplayedData.length / 2) {
                        this._masterTable.Controller.redrawVisibleData();
                    }
                    else {
                        for (var j = 0; j < objectsToRedraw.length; j++) {
                            this._masterTable.Controller.redrawVisibleDataObject(objectsToRedraw[j]);
                        }
                    }
                    this._masterTable.Events.SelectionChanged.invokeAfter(this, this._selectionData);
                };
                SelectionService.prototype.isCellSelected = function (dataObject, column) {
                    var sd = this._selectionData[dataObject['__key']];
                    if (!sd)
                        return false;
                    return sd.indexOf(column.Order) >= 0;
                };
                SelectionService.prototype.hasSelectedCells = function (dataObject) {
                    var sd = this._selectionData[dataObject['__key']];
                    if (!sd)
                        return false;
                    return sd.length > 0;
                };
                SelectionService.prototype.getSelectedCells = function (dataObject) {
                    var sd = this._selectionData[dataObject['__key']];
                    if (!sd)
                        return null;
                    return sd;
                };
                SelectionService.prototype.getSelectedCellsByPrimaryKey = function (dataObject) {
                    var sd = this._selectionData[dataObject['__key']];
                    if (!sd)
                        return false;
                    return sd.length > 0;
                };
                SelectionService.prototype.isSelectedPrimaryKey = function (primaryKey) {
                    var sd = this._selectionData[primaryKey];
                    if (!sd)
                        return false;
                    return sd.length === 0;
                };
                SelectionService.prototype.toggleRow = function (primaryKey, select) {
                    this._masterTable.Events.SelectionChanged.invokeBefore(this, this._selectionData);
                    if (select == undefined || select == null) {
                        select = !this.isSelectedPrimaryKey(primaryKey);
                    }
                    if (select) {
                        if (!this._selectionData.hasOwnProperty(primaryKey)) {
                            if (this._configuration.SelectSingle) {
                                var rk = [];
                                for (var sk in this._selectionData) {
                                    rk.push(sk);
                                }
                                for (var i = 0; i < rk.length; i++) {
                                    delete this._selectionData[rk[i]];
                                    this._masterTable.Controller
                                        .redrawVisibleDataObject(this._masterTable.DataHolder.getByPrimaryKey(rk[i]));
                                }
                            }
                            this._selectionData[primaryKey] = [];
                            this._masterTable.Controller.redrawVisibleDataObject(this._masterTable.DataHolder.getByPrimaryKey(primaryKey));
                            this._masterTable.Events.SelectionChanged.invokeAfter(this, this._selectionData);
                        }
                    }
                    else {
                        if (this._selectionData.hasOwnProperty(primaryKey)) {
                            if (this._configuration.SelectSingle) {
                                var rk = [];
                                for (var sk in this._selectionData) {
                                    rk.push(sk);
                                }
                                for (var i = 0; i < rk.length; i++) {
                                    delete this._selectionData[rk[i]];
                                    this._masterTable.Controller
                                        .redrawVisibleDataObject(this._masterTable.DataHolder.getByPrimaryKey(rk[i]));
                                }
                            }
                            else {
                                delete this._selectionData[primaryKey];
                                this._masterTable.Controller.redrawVisibleDataObject(this._masterTable.DataHolder.getByPrimaryKey(primaryKey));
                            }
                            this._masterTable.Events.SelectionChanged.invokeAfter(this, this._selectionData);
                        }
                    }
                };
                SelectionService.prototype.toggleDisplayingRow = function (rowIndex, selected) {
                    this.toggleRow(this._masterTable.DataHolder.StoredCache[rowIndex]['__key'], selected);
                };
                SelectionService.prototype.toggleObjectSelected = function (dataObject, selected) {
                    this.toggleRow(dataObject['__key'], selected);
                };
                SelectionService.prototype.handleAdjustments = function (added, removeKeys) {
                    for (var i = 0; i < removeKeys.length; i++) {
                        if (this._selectionData.hasOwnProperty(removeKeys[i])) {
                            delete this._selectionData[removeKeys[i]];
                        }
                    }
                };
                SelectionService.prototype.modifyQuery = function (query, scope) {
                    query.Selection = this._selectionData;
                };
                SelectionService.prototype.getSelectedKeys = function () {
                    var keys = [];
                    for (var k in this._selectionData) {
                        keys.push(k);
                    }
                    return keys;
                };
                SelectionService.prototype.getSelectedObjects = function () {
                    var objects = [];
                    for (var k in this._selectionData) {
                        objects.push(this._masterTable.DataHolder.getByPrimaryKey(k));
                    }
                    return objects;
                };
                SelectionService.prototype.getSelectedColumns = function (primaryKey) {
                    var cols = this._masterTable.InstanceManager.Columns;
                    if (!this.isSelectedPrimaryKey(primaryKey))
                        return [];
                    var selObject = this._selectionData[primaryKey];
                    var result = [];
                    for (var i = 0; i < selObject.length; i++) {
                        for (var k in cols) {
                            if (cols[k].Order === selObject[i]) {
                                result.push(cols[k]);
                            }
                        }
                    }
                    return result;
                };
                SelectionService.prototype.getSelectedColumnsByObject = function (dataObject) {
                    return this.getSelectedColumns(dataObject['__key']);
                };
                SelectionService.prototype.toggleCellsByDisplayIndex = function (displayIndex, columnNames, select) {
                    if (displayIndex < 0 || displayIndex >= this._masterTable.DataHolder.DisplayedData.length)
                        return;
                    this.toggleCells(this._masterTable.DataHolder.DisplayedData[displayIndex]['__key'], columnNames, select);
                };
                SelectionService.prototype.toggleCellsByObject = function (dataObject, columnNames, select) {
                    this.toggleCells(dataObject['__key'], columnNames, select);
                };
                SelectionService.prototype.toggleCells = function (primaryKey, columnNames, select) {
                    this._masterTable.Events.SelectionChanged.invokeBefore(this, this._selectionData);
                    var arr = null;
                    if (this._selectionData.hasOwnProperty(primaryKey)) {
                        arr = this._selectionData[primaryKey];
                    }
                    else {
                        arr = [];
                        this._selectionData[primaryKey] = arr;
                    }
                    var cols = this._masterTable.InstanceManager.Columns;
                    var columnsToRedraw = [];
                    var data = this._masterTable.DataHolder.getByPrimaryKey(primaryKey);
                    for (var i = 0; i < columnNames.length; i++) {
                        var idx = cols[columnNames[i]].Order;
                        var colIdx = arr.indexOf(idx);
                        var srcLen = arr.length;
                        var selectIt = select;
                        if ((this._configuration.NonselectableColumns.indexOf(columnNames[i]) < 0))
                            continue;
                        if (selectIt == null || selectIt == undefined) {
                            if (colIdx > -1)
                                selectIt = false;
                            else
                                selectIt = true;
                        }
                        if (this._configuration.CanSelectCellFunction != null && !this._configuration.CanSelectCellFunction(data, columnNames[i], selectIt))
                            continue;
                        if (selectIt && colIdx < 0)
                            arr.push(idx);
                        if ((!selectIt) && colIdx > -1)
                            arr.splice(colIdx, 1);
                        if (srcLen !== arr.length)
                            columnsToRedraw.push(cols[columnNames[i]]);
                    }
                    if (arr.length === 0) {
                        delete this._selectionData[primaryKey];
                    }
                    this._masterTable.Controller.redrawVisibleCells(data, columnsToRedraw);
                    this._masterTable.Events.SelectionChanged.invokeAfter(this, this._selectionData);
                };
                SelectionService.prototype.setCellsByDisplayIndex = function (displayIndex, columnNames) {
                    if (displayIndex < 0 || displayIndex >= this._masterTable.DataHolder.DisplayedData.length)
                        return;
                    this.setCells(this._masterTable.DataHolder.DisplayedData[displayIndex]['__key'], columnNames);
                };
                SelectionService.prototype.setCellsByObject = function (dataObject, columnNames) {
                    this.setCells(dataObject['__key'], columnNames);
                };
                SelectionService.prototype.setCells = function (primaryKey, columnNames) {
                    this._masterTable.Events.SelectionChanged.invokeBefore(this, this._selectionData);
                    var arr = null;
                    if (this._selectionData.hasOwnProperty(primaryKey)) {
                        arr = this._selectionData[primaryKey];
                    }
                    else {
                        arr = [];
                    }
                    var cols = this._masterTable.InstanceManager.Columns;
                    var columnsToRedraw = [];
                    var data = this._masterTable.DataHolder.getByPrimaryKey(primaryKey);
                    var newArr = [];
                    var allColsNames = this._masterTable.InstanceManager.getColumnNames();
                    for (var j = 0; j < columnNames.length; j++) {
                        if (this._configuration.NonselectableColumns) {
                            if ((this._configuration.NonselectableColumns.indexOf(columnNames[j]) < 0))
                                continue;
                        }
                        if (this._configuration.CanSelectCellFunction != null && !this._configuration.CanSelectCellFunction(data, columnNames[j], true))
                            continue;
                        newArr.push(cols[columnNames[j]].Order);
                    }
                    var maxArr = newArr.length > arr.length ? newArr : arr;
                    for (var k = 0; k < maxArr.length; k++) {
                        var colNum = maxArr[k];
                        var nw = newArr.indexOf(colNum) > -1;
                        var old = arr.indexOf(colNum) > -1;
                        if (nw && !old)
                            columnsToRedraw.push(cols[allColsNames[colNum]]);
                        if (old && !nw)
                            columnsToRedraw.push(cols[allColsNames[colNum]]);
                    }
                    if (newArr.length === 0) {
                        delete this._selectionData[primaryKey];
                    }
                    else {
                        this._selectionData[primaryKey] = newArr;
                    }
                    this._masterTable.Controller.redrawVisibleCells(data, columnsToRedraw);
                    this._masterTable.Events.SelectionChanged.invokeAfter(this, this._selectionData);
                };
                SelectionService.prototype.handleAdditionalData = function (additionalData) {
                    var ad = additionalData;
                    if (ad.SelectionToggle === Reinforced.Lattice.Adjustments.SelectionToggle.All) {
                        this.toggleAll(true);
                    }
                    else if (ad.SelectionToggle === Reinforced.Lattice.Adjustments.SelectionToggle.Nothing) {
                        this.resetSelection();
                    }
                    else {
                        for (var ok in ad.Select) {
                            if (ad.Select[ok] == null || ad.Select[ok].length === 0) {
                                this.toggleRow(ok, true);
                            }
                            else {
                                this.setCells(ok, ad.Select[ok]);
                            }
                        }
                        for (var ok2 in ad.Unselect) {
                            if (ad.Unselect[ok2] == null || ad.Unselect[ok2].length === 0) {
                                this.toggleRow(ok2, true);
                            }
                            else {
                                this.toggleCells(ok2, ad.Unselect[ok2], false);
                            }
                        }
                    }
                };
                return SelectionService;
            }());
            Services.SelectionService = SelectionService;
        })(Services = Lattice.Services || (Lattice.Services = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Services;
        (function (Services) {
            var StatsService = (function () {
                function StatsService(master) {
                    this._master = master;
                }
                StatsService.prototype.IsSetFinite = function () { return this._master.Partition.isAmountFinite(); };
                StatsService.prototype.Mode = function () { return this._master.Configuration.Partition.Type; };
                StatsService.prototype.ServerCount = function () { return this._master.Partition.totalAmount(); };
                StatsService.prototype.Stored = function () { return this._master.DataHolder.StoredData.length; };
                StatsService.prototype.Filtered = function () { return (!this._master.DataHolder.Filtered) ? 0 : this._master.DataHolder.Filtered.length; };
                StatsService.prototype.Displayed = function () { return (!this._master.DataHolder.DisplayedData) ? 0 : this._master.DataHolder.DisplayedData.length; };
                StatsService.prototype.Ordered = function () { return (!this._master.DataHolder.Ordered) ? 0 : this._master.DataHolder.Ordered.length; };
                StatsService.prototype.Skip = function () { return this._master.Partition.Skip; };
                StatsService.prototype.Take = function () { return this._master.Partition.Take; };
                StatsService.prototype.Pages = function () {
                    if (this._master.Partition.Take === 0)
                        return 1;
                    var tp = this._master.Partition.amount() / this._master.Partition.Take;
                    if (tp !== Math.floor(tp)) {
                        tp = Math.floor(tp) + 1;
                    }
                    return tp;
                };
                StatsService.prototype.CurrentPage = function () {
                    if (this._master.Partition.Skip + this._master.Partition.Take >= this._master.Partition.amount()) {
                        return this.Pages() - 1;
                    }
                    if (this._master.Partition.Take === 0)
                        return 0;
                    if (this._master.Partition.Skip < this._master.Partition.Take)
                        return 0;
                    var sp = this._master.Partition.Skip / this._master.Partition.Take;
                    return Math.floor(sp);
                };
                StatsService.prototype.IsAllDataLoaded = function () {
                    if (this._master.Configuration.Partition.Type === Reinforced.Lattice.PartitionType.Client)
                        return true;
                };
                return StatsService;
            }());
            Services.StatsService = StatsService;
        })(Services = Lattice.Services || (Lattice.Services = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Services;
        (function (Services) {
            var Partition;
            (function (Partition) {
                var BackgroundDataLoader = (function () {
                    function BackgroundDataLoader(masterTable, conf) {
                        this._afterFn = null;
                        this._indicationShown = false;
                        this._masterTable = masterTable;
                        this.Indicator = new Reinforced.Lattice.Services.Partition.PartitionIndicatorRow(masterTable, this, conf);
                        this.LoadAhead = conf.LoadAhead;
                        this.AppendLoadingRow = conf.AppendLoadingRow;
                        this.UseLoadMore = conf.UseLoadMore;
                    }
                    BackgroundDataLoader.prototype.skipTake = function (skip, take) {
                        this.Skip = skip;
                        this.Take = take;
                    };
                    BackgroundDataLoader.prototype.provideIndicator = function (rows) {
                        this._indicationShown = true;
                        rows.push(this.Indicator);
                    };
                    BackgroundDataLoader.prototype.loadNextDataPart = function (pages, after) {
                        if (this.IsLoadingNextPart) {
                            if (after != null)
                                this._afterFn = after;
                            return;
                        }
                        if (this.FinishReached) {
                            if (after != null)
                                after();
                            return;
                        }
                        this._afterFn = after;
                        if (this.UseLoadMore) {
                            this.showIndication();
                            return;
                        }
                        this.loadNextCore(pages);
                    };
                    BackgroundDataLoader.prototype.loadNextCore = function (pages, show) {
                        var _this = this;
                        if (pages == null)
                            pages = this.LoadAhead;
                        if (show == null)
                            show = false;
                        this.IsLoadingNextPart = true;
                        this.ClientSearchParameters = BackgroundDataLoader.any(this._masterTable.DataHolder.RecentClientQuery.Filterings);
                        if (this.AppendLoadingRow)
                            this.showIndication();
                        this._masterTable.Loader.query(function (d) { return _this.dataAppendLoaded(d, pages, show); }, function (q) { return _this.modifyDataAppendQuery(q, pages); }, this._dataAppendError, true);
                    };
                    BackgroundDataLoader.prototype.dataAppendError = function (data) {
                        this.IsLoadingNextPart = false;
                        if (this.AppendLoadingRow)
                            this.destroyIndication();
                    };
                    BackgroundDataLoader.prototype.modifyDataAppendQuery = function (q, pages) {
                        q.IsBackgroundDataFetch = true;
                        q.Partition = {
                            NoCount: true,
                            Skip: this._masterTable.DataHolder.StoredData.length,
                            Take: this.Take * pages
                        };
                        return q;
                    };
                    BackgroundDataLoader.any = function (o) {
                        for (var k in o)
                            if (o.hasOwnProperty(k))
                                return true;
                        return false;
                    };
                    BackgroundDataLoader.prototype.dataAppendLoaded = function (data, pagesRequested, show) {
                        var _this = this;
                        this.IsLoadingNextPart = false;
                        if (this.AppendLoadingRow)
                            this.destroyIndication();
                        this.FinishReached = (data.BatchSize < this.Take * pagesRequested);
                        if (this._masterTable.DataHolder.DisplayedData.length > 0)
                            this._masterTable.Controller.redrawVisibleData();
                        if (this._masterTable.DataHolder.Ordered.length < this.Take * pagesRequested) {
                            if (this.UseLoadMore) {
                                this.destroyIndication();
                                if (!this.FinishReached) {
                                    this.showIndication();
                                }
                            }
                            else {
                                if (!this.FinishReached) {
                                    setTimeout(function () { return _this.loadNextDataPart(pagesRequested); }, 5);
                                }
                            }
                        }
                        else {
                            if (this._afterFn != null) {
                                this._afterFn();
                                this._afterFn = null;
                            }
                        }
                    };
                    BackgroundDataLoader.prototype.showIndication = function () {
                        if (this._indicationShown)
                            return;
                        this._masterTable.Renderer.Modifier.appendRow(this.Indicator);
                        this._indicationShown = true;
                    };
                    BackgroundDataLoader.prototype.destroyIndication = function () {
                        if (!this._indicationShown)
                            return;
                        this._masterTable.Renderer.Modifier.destroyPartitionRow();
                        this._indicationShown = false;
                    };
                    BackgroundDataLoader.prototype.loadMore = function (show, page) {
                        this.destroyIndication();
                        this.loadNextCore(page, show);
                    };
                    return BackgroundDataLoader;
                }());
                Partition.BackgroundDataLoader = BackgroundDataLoader;
            })(Partition = Services.Partition || (Services.Partition = {}));
        })(Services = Lattice.Services || (Lattice.Services = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Services;
        (function (Services) {
            var Partition;
            (function (Partition) {
                var ClientPartitionService = (function () {
                    function ClientPartitionService(masterTable) {
                        this._masterTable = masterTable;
                        this.Type = Reinforced.Lattice.PartitionType.Client;
                    }
                    ClientPartitionService.prototype.setSkip = function (skip, preserveTake) {
                        if (preserveTake == null)
                            preserveTake = true;
                        if (skip < 0)
                            skip = 0;
                        var floatingSkip = skip;
                        skip = Math.floor(skip);
                        var prevSkip = this.Skip;
                        if (this._masterTable.Configuration.Lines != null) {
                            skip = Math.floor(skip / this._masterTable.Configuration.Lines.RowsInLine) *
                                this._masterTable.Configuration.Lines.RowsInLine;
                        }
                        var take = this.Take;
                        if (take > 0) {
                            if (skip + take > this.amount()) {
                                if (preserveTake) {
                                    skip = this.amount() - take;
                                    floatingSkip = skip;
                                }
                                else
                                    take = this.amount() - skip;
                            }
                        }
                        else {
                            take = this.amount() - skip;
                        }
                        if (prevSkip === skip) {
                            this.beforeSkipTake(null, floatingSkip);
                            this.adjustSkipTake(null, floatingSkip);
                            return;
                        }
                        this.beforeSkipTake(skip, floatingSkip, take);
                        if (skip >= prevSkip + take || skip <= prevSkip - take) {
                            this.cutDisplayed(skip, take);
                            this._masterTable.Controller.redrawVisibleData();
                        }
                        else {
                            if (this._masterTable.Configuration.Lines != null && this._masterTable.Configuration.Lines.UseTemplate) {
                                this.scrollLines(skip, take, prevSkip);
                            }
                            else {
                                this.scrollRows(skip, take, prevSkip);
                            }
                            this._masterTable.Events.DataRendered.invokeAfter(this, null);
                        }
                        this.adjustSkipTake(skip, floatingSkip);
                    };
                    ClientPartitionService.prototype.scrollLines = function (skip, take, prevSkip) {
                        var prevIdx = this.displayedIndexes();
                        var lineSize = this._masterTable.Configuration.Lines.RowsInLine;
                        var prevLines = prevIdx.length / lineSize;
                        this.cutDisplayed(skip, take);
                        var diff = Math.abs(prevSkip - skip);
                        var linesDiff = diff / lineSize;
                        var down = skip > prevSkip;
                        var rows = this._masterTable.Controller.produceRows();
                        this.destroySpecialRows(rows);
                        for (var i = 0; i < linesDiff; i++) {
                            if (down) {
                                this._masterTable.Renderer.Modifier.destroyLineByIndex(i);
                            }
                            else {
                                this._masterTable.Renderer.Modifier.destroyLineByIndex(prevLines - i - 1);
                            }
                        }
                        if (down) {
                            var li = this.lastNonSpecialIndex(rows) - diff + 1;
                            for (var j = 0; j < linesDiff; j++) {
                                var splStart = li + j * lineSize;
                                var line = {
                                    Number: 0,
                                    Rows: rows.slice(splStart, splStart + lineSize)
                                };
                                this._masterTable.Renderer.Modifier.appendLine(line);
                            }
                        }
                        else {
                            var fi = this.firstNonSpecialIndex(rows);
                            for (var k = linesDiff - 1; k >= 0; k--) {
                                var splStart2 = fi + k * lineSize;
                                var revline = {
                                    Number: 0,
                                    Rows: rows.slice(splStart2, splStart2 + lineSize)
                                };
                                this._masterTable.Renderer.Modifier.prependLine(revline);
                            }
                        }
                        var limes = this._masterTable.Renderer.Locator.getLineElements();
                        for (var l = 0; l < limes.length; l++) {
                            limes.item(l).setAttribute('data-track', Lattice.TrackHelper.getLineTrackByIndex(l));
                        }
                        this.restoreSpecialRows(rows);
                    };
                    ClientPartitionService.prototype.scrollRows = function (skip, take, prevSkip) {
                        var prevIdx = this.displayedIndexes();
                        this.cutDisplayed(skip, take);
                        var diff = Math.abs(prevSkip - skip);
                        var down = skip > prevSkip;
                        var rows = this._masterTable.Controller.produceRows();
                        this.destroySpecialRows(rows);
                        for (var i = 0; i < diff; i++) {
                            var toDestroy = down ? prevIdx[i] : prevIdx[prevIdx.length - 1 - i];
                            this._masterTable.Renderer.Modifier.destroyRowByIndex(toDestroy);
                        }
                        if (down) {
                            var li = this.lastNonSpecialIndex(rows) - diff + 1;
                            for (var j = 0; j < diff; j++) {
                                this._masterTable.Renderer.Modifier.appendRow(rows[li + j]);
                            }
                        }
                        else {
                            var fi = this.firstNonSpecialIndex(rows) + diff - 1;
                            for (var k = 0; k < diff; k++) {
                                this._masterTable.Renderer.Modifier.prependRow(rows[fi - k]);
                            }
                        }
                        this.restoreSpecialRows(rows);
                    };
                    ClientPartitionService.prototype.firstNonSpecialIndex = function (rows) {
                        for (var i = 0; i < rows.length; i++) {
                            if (!rows[i].IsSpecial)
                                return i;
                        }
                        return 0;
                    };
                    ClientPartitionService.prototype.lastNonSpecialIndex = function (rows) {
                        if (rows.length === 0)
                            return 0;
                        if (!rows[rows.length - 1].IsSpecial)
                            return rows.length - 1;
                        for (var i = rows.length - 1; i >= 0; i--) {
                            if (!rows[i].IsSpecial)
                                return i;
                        }
                        return 0;
                    };
                    ClientPartitionService.prototype.displayedIndexes = function () {
                        var currentIndexes = [];
                        for (var i = 0; i < this._masterTable.DataHolder.DisplayedData.length; i++) {
                            currentIndexes.push(this._masterTable.DataHolder.DisplayedData[i]['__i']);
                        }
                        return currentIndexes;
                    };
                    ClientPartitionService.prototype.setTake = function (take) {
                        this.beforeSkipTake(null, null, take);
                        if (!this._masterTable.DataHolder.RecentClientQuery) {
                            this.Take = take;
                            this._masterTable.Controller.reload();
                            this.adjustSkipTake();
                            return;
                        }
                        if (take === 0) {
                            this.cutDisplayed(0, 0);
                            this.adjustSkipTake(0, 0, 0);
                            this._masterTable.Controller.redrawVisibleData();
                            return;
                        }
                        var prevTake = this.Take;
                        if (prevTake === 0) {
                            var disp = this.displayedIndexes();
                            this.cutDisplayed(this.Skip, take);
                            for (var k = take; k < disp.length; k++) {
                                this._masterTable.Renderer.Modifier.destroyRowByIndex(disp[k]);
                            }
                        }
                        else if (take < prevTake) {
                            var dd = this.displayedIndexes();
                            this.cutDisplayed(this.Skip, take);
                            for (var i = take; i < prevTake; i++) {
                                this._masterTable.Renderer.Modifier.destroyRowByIndex(dd[i]);
                            }
                        }
                        else {
                            var prevIdx = this.displayedIndexes();
                            var rows = this._masterTable.Controller.produceRows();
                            var specialCount = this.destroySpecialRows(rows);
                            this.cutDisplayed(this.Skip, take);
                            rows = this._masterTable.Controller.produceRows();
                            if (take > rows.length - specialCount) {
                                take = rows.length - specialCount;
                            }
                            var woSpecial = [];
                            for (var l = 0; l < rows.length; l++) {
                                if (!rows[l].IsSpecial) {
                                    woSpecial.push(rows[l]);
                                }
                            }
                            if (prevTake !== woSpecial.length) {
                                for (var j = prevIdx.length; j < woSpecial.length; j++) {
                                    this._masterTable.Renderer.Modifier.appendRow(rows[j]);
                                }
                            }
                            this.restoreSpecialRows(rows);
                            this._masterTable.Events.DataRendered.invokeAfter(this, null);
                        }
                        this.Take = take;
                        this.adjustSkipTake(null, null, take);
                    };
                    ClientPartitionService.prototype.restoreSpecialRows = function (rows) {
                        for (var i = 0; i < rows.length; i++) {
                            if (rows[i].IsSpecial) {
                                if (i === 0)
                                    this._masterTable.Renderer.Modifier.prependRow(rows[i]);
                                else if (i === rows.length - 1) {
                                    this._masterTable.Renderer.Modifier.appendRow(rows[i]);
                                }
                                else {
                                    if (rows[i + 1].IsSpecial)
                                        this._masterTable.Renderer.Modifier.appendRow(rows[i]);
                                    else
                                        this._masterTable.Renderer.Modifier.appendRow(rows[i], rows[i + 1].Index);
                                }
                            }
                        }
                    };
                    ClientPartitionService.prototype.destroySpecialRows = function (rows) {
                        var destroyed = 0;
                        for (var i = 0; i < rows.length / 2; i++) {
                            if (rows[i].IsSpecial) {
                                this._masterTable.Renderer.Modifier.destroyRowByIndex(rows[i].Index);
                                destroyed++;
                            }
                            if (rows[rows.length - i - 1].IsSpecial) {
                                this._masterTable.Renderer.Modifier.destroyRowByIndex(rows[rows.length - i - 1].Index);
                                destroyed++;
                            }
                        }
                        return destroyed;
                    };
                    ClientPartitionService.prototype.partitionBeforeQuery = function (serverQuery, clientQuery, isServerQuery) {
                        serverQuery.Partition = {
                            NoCount: true,
                            Take: 0,
                            Skip: 0
                        };
                        clientQuery.Partition = {
                            NoCount: true,
                            Take: this.Take,
                            Skip: this.Skip
                        };
                        return isServerQuery;
                    };
                    ClientPartitionService.prototype.partitionBeforeCommand = function (serverQuery) {
                        serverQuery.Partition = {
                            NoCount: true,
                            Take: this.Take,
                            Skip: this.Skip
                        };
                    };
                    ClientPartitionService.prototype.beforeSkipTake = function (skip, floatingSkip, take) {
                        this._masterTable.Events.PartitionChanged.invokeBefore(this, {
                            PreviousSkip: this.Skip,
                            Skip: skip || this.Skip,
                            PreviousFloatingSkip: this.FloatingSkip,
                            FloatingSkip: floatingSkip || this.FloatingSkip,
                            PreviousTake: this.Take,
                            Take: take || this.Take
                        });
                    };
                    ClientPartitionService.prototype.adjustSkipTake = function (skip, floatingSkip, take) {
                        var changed = (skip != null && this.Skip !== skip)
                            || (floatingSkip != null && this.FloatingSkip !== floatingSkip)
                            || (take != null && this.Take !== take);
                        if (!changed)
                            return;
                        var prevSkip = this.Skip;
                        var prevFloatSkip = this.FloatingSkip;
                        var prevTake = this.Take;
                        if (skip != null)
                            this.Skip = skip;
                        if (floatingSkip != null)
                            this.FloatingSkip = floatingSkip;
                        if (take != null)
                            this.Take = take;
                        this._masterTable.Events.PartitionChanged.invokeAfter(this, {
                            PreviousSkip: prevSkip,
                            Skip: skip,
                            PreviousTake: prevTake,
                            Take: this.Take,
                            PreviousFloatingSkip: prevFloatSkip,
                            FloatingSkip: floatingSkip
                        });
                        if (this._masterTable.Configuration.Partition.BalancerFunction != null) {
                            this._masterTable.Configuration.Partition.BalancerFunction({
                                Skip: floatingSkip,
                                Take: this.Take
                            });
                        }
                    };
                    ClientPartitionService.prototype.partitionAfterQuery = function (initialSet, query, serverCount) {
                        if (initialSet.length !== 0 && this.Skip + this.Take > initialSet.length) {
                            var skp = initialSet.length - this.Take;
                            if (skp < 0)
                                skp = 0;
                            this.adjustSkipTake(skp, skp);
                        }
                        var result = this.skipTakeSet(initialSet, query);
                        return result;
                    };
                    ClientPartitionService.prototype.skipTakeSet = function (ordered, query) {
                        return this.cut(ordered, this.Skip, this.Take);
                    };
                    ClientPartitionService.prototype.cut = function (ordered, skip, take) {
                        var selected = ordered;
                        if (skip > ordered.length)
                            skip = 0;
                        if (take === 0)
                            selected = ordered.slice(skip);
                        else
                            selected = ordered.slice(skip, skip + take);
                        return selected;
                    };
                    ClientPartitionService.prototype.cutDisplayed = function (skip, take) {
                        this._masterTable.DataHolder.RecentClientQuery.Partition = {
                            NoCount: true,
                            Skip: skip,
                            Take: take
                        };
                        this._masterTable.Events.ClientDataProcessing.invokeBefore(this, this._masterTable.DataHolder.RecentClientQuery);
                        this._masterTable.DataHolder.DisplayedData = this.cut(this._masterTable.DataHolder.Ordered, skip, take);
                        this._masterTable.Events.ClientDataProcessing.invokeAfter(this, {
                            Displaying: this._masterTable.DataHolder.DisplayedData,
                            Filtered: this._masterTable.DataHolder.Filtered,
                            Ordered: this._masterTable.DataHolder.Ordered,
                            Source: this._masterTable.DataHolder.StoredData,
                            OnlyPartitionPerformed: true
                        });
                    };
                    ClientPartitionService.prototype.amount = function () {
                        return (!this._masterTable.DataHolder.Ordered) ? 0 : this._masterTable.DataHolder.Ordered.length;
                    };
                    ClientPartitionService.prototype.lines = function () {
                        var r = this.amount();
                        if (this._masterTable.Configuration.Lines != null) {
                            var c = r / this._masterTable.Configuration.Lines.RowsInLine;
                            if (c > Math.floor(c)) {
                                return Math.floor(c) + 1;
                            }
                            else {
                                return Math.floor(c);
                            }
                        }
                        return r;
                    };
                    ClientPartitionService.prototype.isAmountFinite = function () {
                        return true;
                    };
                    ClientPartitionService.prototype.totalAmount = function () {
                        return this._masterTable.DataHolder.StoredData.length;
                    };
                    ClientPartitionService.prototype.initial = function (skip, take) {
                        this.Skip = skip;
                        this.FloatingSkip = skip;
                        this.Take = take;
                        this._masterTable.Events.PartitionChanged.invokeAfter(this, {
                            PreviousSkip: 0,
                            Skip: skip,
                            PreviousTake: 0,
                            Take: take,
                            PreviousFloatingSkip: 0,
                            FloatingSkip: skip
                        });
                    };
                    ClientPartitionService.prototype.isClient = function () { return true; };
                    ClientPartitionService.prototype.isServer = function () { return false; };
                    ClientPartitionService.prototype.hasEnoughDataToSkip = function (skip) {
                        if (skip < 0)
                            return false;
                        if (skip > this.amount() - this.Take)
                            return false;
                        return true;
                    };
                    ClientPartitionService.prototype.any = function (o) {
                        for (var k in o)
                            if (o.hasOwnProperty(k))
                                return true;
                        return false;
                    };
                    return ClientPartitionService;
                }());
                Partition.ClientPartitionService = ClientPartitionService;
            })(Partition = Services.Partition || (Services.Partition = {}));
        })(Services = Lattice.Services || (Lattice.Services = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Services;
        (function (Services) {
            var Partition;
            (function (Partition) {
                var PartitionIndicatorRow = (function () {
                    function PartitionIndicatorRow(masterTable, dataLoader, conf) {
                        this.Command = null;
                        this.DisplayIndex = -1;
                        this.IsLast = false;
                        this.IsSpecial = true;
                        this.Index = 0;
                        this.Cells = {};
                        this.DataObject = new PartitionIndicator(masterTable, dataLoader);
                        this.MasterTable = masterTable;
                        this._dataLoader = dataLoader;
                        this.TemplateIdOverride = conf.LoadingRowTemplateId;
                        this.Show = true;
                    }
                    PartitionIndicatorRow.prototype.loadMore = function () {
                        var loadPages = null;
                        if (this.PagesInput) {
                            loadPages = parseInt(this.PagesInput.value);
                            if (isNaN(loadPages))
                                loadPages = null;
                        }
                        this._dataLoader.loadMore(this.Show, loadPages);
                    };
                    return PartitionIndicatorRow;
                }());
                Partition.PartitionIndicatorRow = PartitionIndicatorRow;
                var PartitionIndicator = (function () {
                    function PartitionIndicator(masterTable, partitionService) {
                        this._masterTable = masterTable;
                        this._dataLoader = partitionService;
                    }
                    PartitionIndicator.prototype.UiColumnsCount = function () { return this._masterTable.InstanceManager.getUiColumns().length; };
                    PartitionIndicator.prototype.IsLoading = function () {
                        return this._dataLoader.IsLoadingNextPart;
                    };
                    PartitionIndicator.prototype.Stats = function () { return this._masterTable.Stats; };
                    PartitionIndicator.prototype.IsClientSearchPending = function () {
                        return this._dataLoader.ClientSearchParameters;
                    };
                    PartitionIndicator.prototype.CanLoadMore = function () {
                        return !this._dataLoader.FinishReached;
                    };
                    PartitionIndicator.prototype.LoadAhead = function () {
                        return this._dataLoader.LoadAhead;
                    };
                    return PartitionIndicator;
                }());
                Partition.PartitionIndicator = PartitionIndicator;
            })(Partition = Services.Partition || (Services.Partition = {}));
        })(Services = Lattice.Services || (Lattice.Services = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Services;
        (function (Services) {
            var Partition;
            (function (Partition) {
                var SequentialPartitionService = (function (_super) {
                    __extends(SequentialPartitionService, _super);
                    function SequentialPartitionService(masterTable) {
                        var _this = _super.call(this, masterTable) || this;
                        _this._takeDiff = 0;
                        _this._provideIndication = false;
                        _this._backgroundLoad = false;
                        _this._masterTable = masterTable;
                        _this._conf = masterTable.Configuration.Partition.Sequential;
                        _this.DataLoader = new Reinforced.Lattice.Services.Partition.BackgroundDataLoader(masterTable, _this._conf);
                        _this.DataLoader.UseLoadMore = _this._conf.UseLoadMore;
                        _this.DataLoader.AppendLoadingRow = _this._conf.AppendLoadingRow;
                        if (_this._conf.AppendLoadingRow || _this._conf.UseLoadMore) {
                            _this._masterTable.Controller.registerAdditionalRowsProvider(_this);
                        }
                        _this.Type = Reinforced.Lattice.PartitionType.Sequential;
                        return _this;
                    }
                    SequentialPartitionService.prototype.setSkip = function (skip, preserveTake) {
                        if (this.Skip === 0 && skip <= 0)
                            return;
                        this.DataLoader.skipTake(skip, this.Take);
                        _super.prototype.setSkip.call(this, skip, preserveTake);
                        if (skip + this.Take + this._conf.LoadAhead > this._masterTable.DataHolder.Ordered.length) {
                            this.DataLoader.loadNextDataPart(this._conf.LoadAhead);
                        }
                        else {
                            this.DataLoader.destroyIndication();
                        }
                    };
                    SequentialPartitionService.prototype.setTake = function (take) {
                        var _this = this;
                        var noData = !this._masterTable.DataHolder.RecentClientQuery;
                        if (noData)
                            return;
                        if (this.Skip + take + this._conf.LoadAhead > this._masterTable.DataHolder.Ordered.length) {
                            this.DataLoader.skipTake(this.Skip, take);
                            this.DataLoader.loadNextDataPart(this._conf.LoadAhead, function () { return _super.prototype.setTake.call(_this, take); });
                        }
                        else {
                            _super.prototype.setTake.call(this, take);
                        }
                    };
                    SequentialPartitionService.prototype.isAmountFinite = function () {
                        return this.DataLoader.FinishReached;
                    };
                    SequentialPartitionService.prototype.amount = function () {
                        return _super.prototype.amount.call(this);
                    };
                    SequentialPartitionService.prototype.resetSkip = function (take) {
                        if (this.Skip === 0 && take === this.Take)
                            return;
                        this.DataLoader.skipTake(0, take);
                        this.adjustSkipTake(0, 0, take);
                    };
                    SequentialPartitionService.prototype.partitionBeforeQuery = function (serverQuery, clientQuery, isServerQuery) {
                        if ((serverQuery) && serverQuery.IsBackgroundDataFetch)
                            return isServerQuery;
                        this.resetSkip(this.Take);
                        if (this.Owner != null) {
                            var hasClientFilters = this.any(clientQuery.Filterings);
                            if (!hasClientFilters) {
                                this.Owner.switchBack(serverQuery, clientQuery, isServerQuery);
                                return true;
                            }
                        }
                        serverQuery.Partition = { NoCount: true, Take: this.Take * this._conf.LoadAhead, Skip: this.Skip };
                        clientQuery.Partition = {
                            NoCount: true,
                            Take: this.Take,
                            Skip: this.Skip
                        };
                        return isServerQuery;
                    };
                    SequentialPartitionService.prototype.partitionAfterQuery = function (initialSet, query, serverCount) {
                        var result = this.skipTakeSet(initialSet, query);
                        if (!query.IsBackgroundDataFetch) {
                            var activeClientFiltering = this.any(query.Filterings);
                            this.DataLoader.ClientSearchParameters = activeClientFiltering;
                            var enough = initialSet.length >= this.Take * this._conf.LoadAhead;
                            if (activeClientFiltering && !enough) {
                                if (this._conf.UseLoadMore) {
                                    this._provideIndication = true;
                                }
                                else {
                                    this._backgroundLoad = true;
                                }
                            }
                        }
                        return result;
                    };
                    SequentialPartitionService.prototype.provide = function (rows) {
                        this.DataLoader.skipTake(this.Skip, this.Take);
                        if (this._provideIndication) {
                            this.DataLoader.provideIndicator(rows);
                            this._provideIndication = false;
                        }
                        if (this._backgroundLoad) {
                            this._backgroundLoad = false;
                            this.DataLoader.loadNextDataPart(this._conf.LoadAhead);
                        }
                    };
                    SequentialPartitionService.prototype.hasEnoughDataToSkip = function (skip) {
                        if (skip < 0)
                            return false;
                        if (skip > this.amount() - this.Take)
                            return false;
                        return (skip > 0) && (skip <= (this._masterTable.DataHolder.Ordered.length - this.Take));
                    };
                    SequentialPartitionService.prototype.isClient = function () { return false; };
                    SequentialPartitionService.prototype.isServer = function () { return true; };
                    return SequentialPartitionService;
                }(Partition.ClientPartitionService));
                Partition.SequentialPartitionService = SequentialPartitionService;
            })(Partition = Services.Partition || (Services.Partition = {}));
        })(Services = Lattice.Services || (Lattice.Services = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Services;
        (function (Services) {
            var Partition;
            (function (Partition) {
                var ServerPartitionService = (function (_super) {
                    __extends(ServerPartitionService, _super);
                    function ServerPartitionService(masterTable) {
                        var _this = _super.call(this, masterTable) || this;
                        _this._serverSkip = 0;
                        _this._masterTable = masterTable;
                        _this._conf = masterTable.Configuration.Partition.Server;
                        _this._seq = new Reinforced.Lattice.Services.Partition.SequentialPartitionService(masterTable);
                        _this._dataLoader = new Reinforced.Lattice.Services.Partition.BackgroundDataLoader(masterTable, _this._conf);
                        _this._dataLoader.UseLoadMore = _this._conf.UseLoadMore;
                        _this._dataLoader.AppendLoadingRow = _this._conf.AppendLoadingRow;
                        _this._dataLoader.Indicator.Show = false;
                        _this.Type = Reinforced.Lattice.PartitionType.Server;
                        return _this;
                    }
                    ServerPartitionService.prototype.setSkip = function (skip, preserveTake) {
                        if (this.Skip === 0 && skip <= 0 && this._serverSkip === 0)
                            return;
                        if (this.Skip + this.Take >= this._serverTotalCount && skip >= this.Skip) {
                            return;
                        }
                        if (preserveTake == null)
                            preserveTake = true;
                        var iSkip = skip - this._serverSkip;
                        var take = this.Take;
                        if (((iSkip + this.Take + this._conf.LoadAhead) > this._masterTable.DataHolder.Ordered.length) || (iSkip < 0)) {
                            if ((iSkip > this._masterTable.DataHolder.Ordered.length) || (iSkip < 0)) {
                                if (skip + this.Take > this._serverTotalCount) {
                                    if (preserveTake) {
                                        skip = this._serverTotalCount - this.Take;
                                    }
                                    else {
                                        take = this._serverTotalCount - skip;
                                    }
                                }
                                this.adjustSkipTake(skip, skip, take);
                                this._serverSkip = skip;
                                this._masterTable.Controller.reload(true);
                                return;
                            }
                            else {
                                this._dataLoader.skipTake(skip, this.Take);
                                this._dataLoader.loadNextDataPart(this._conf.LoadAhead);
                                _super.prototype.setSkip.call(this, skip, preserveTake);
                                return;
                            }
                        }
                        _super.prototype.setSkip.call(this, skip, preserveTake);
                    };
                    ServerPartitionService.prototype.cut = function (ordered, skip, take) {
                        skip = skip - this._serverSkip;
                        var selected = null;
                        if (skip > ordered.length)
                            skip = 0;
                        if (take === 0)
                            selected = ordered.slice(skip);
                        else
                            selected = ordered.slice(skip, skip + take);
                        return selected;
                    };
                    ServerPartitionService.prototype.setTake = function (take) {
                        var _this = this;
                        var iSkip = this.Skip - this._serverSkip;
                        var noData = !this._masterTable.DataHolder.RecentClientQuery;
                        _super.prototype.setTake.call(this, take);
                        if (noData)
                            return;
                        if ((iSkip + (take * 2) > this._masterTable.DataHolder.Ordered.length)) {
                            this._dataLoader.skipTake(this.Skip, take);
                            this._dataLoader.loadNextDataPart(this._conf.LoadAhead, function () { return _super.prototype.setTake.call(_this, take); });
                        }
                    };
                    ServerPartitionService.prototype.partitionBeforeQuery = function (serverQuery, clientQuery, isServerQuery) {
                        if (serverQuery.IsBackgroundDataFetch)
                            return isServerQuery;
                        this._dataLoader.skipTake(this.Skip, this.Take);
                        var hasClientFilters = this.any(clientQuery.Filterings);
                        if (hasClientFilters) {
                            this.switchToSequential();
                            this._seq.partitionBeforeQuery(serverQuery, clientQuery, isServerQuery);
                            return true;
                        }
                        else {
                            serverQuery.Partition = { NoCount: false, Take: this.Take * this._conf.LoadAhead, Skip: this.Skip };
                        }
                        clientQuery.Partition = {
                            NoCount: true,
                            Take: this.Take,
                            Skip: this.Skip
                        };
                        return isServerQuery;
                    };
                    ServerPartitionService.prototype.resetSkip = function (take) {
                        this._serverSkip = 0;
                        if (this.Skip === 0 && this.Take === take)
                            return;
                        this._dataLoader.skipTake(0, take);
                        this.adjustSkipTake(0, 0, take);
                    };
                    ServerPartitionService.prototype.switchToSequential = function () {
                        this._masterTable.Partition = this._seq;
                        this._seq.Owner = this;
                        this._seq.Take = this.Take;
                    };
                    ServerPartitionService.prototype.switchBack = function (serverQuery, clientQuery, isServerQuery) {
                        this._masterTable.Partition = this;
                        this.resetSkip(this._seq.Take);
                        this.partitionBeforeQuery(serverQuery, clientQuery, isServerQuery);
                    };
                    ServerPartitionService.prototype.partitionAfterQuery = function (initialSet, query, serverCount) {
                        if (serverCount !== -1)
                            this._serverTotalCount = serverCount;
                        var result = this.skipTakeSet(initialSet, query);
                        return result;
                    };
                    ServerPartitionService.prototype.isAmountFinite = function () {
                        return true;
                    };
                    ServerPartitionService.prototype.totalAmount = function () {
                        return this._serverTotalCount;
                    };
                    ServerPartitionService.prototype.amount = function () {
                        return this._serverTotalCount;
                    };
                    ServerPartitionService.prototype.isClient = function () { return false; };
                    ServerPartitionService.prototype.isServer = function () { return true; };
                    ServerPartitionService.prototype.hasEnoughDataToSkip = function (skip) {
                        if (skip < 0)
                            return false;
                        if (skip > this.amount() - this.Take)
                            return false;
                        var iSkip = skip - this._serverSkip;
                        return (iSkip > 0) && (iSkip <= (this._masterTable.DataHolder.Ordered.length - this.Take));
                    };
                    return ServerPartitionService;
                }(Partition.ClientPartitionService));
                Partition.ServerPartitionService = ServerPartitionService;
            })(Partition = Services.Partition || (Services.Partition = {}));
        })(Services = Lattice.Services || (Lattice.Services = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Templating;
        (function (Templating) {
            var Driver = (function () {
                function Driver() {
                }
                Driver.body = function (p) {
                    p.w(' data-track="body" ');
                };
                Driver.content = function (p, columnName) {
                    if (p.Context.Object.renderContent) {
                        p.Context.Object.renderContent(p);
                    }
                    else {
                        switch (p.Context.Type) {
                            case Templating.RenderedObject.Header:
                                Driver.headerContent(p.Context.Object, p);
                                break;
                            case Templating.RenderedObject.Plugin:
                                throw new Error('It is required to override renderContent for plugin');
                            case Templating.RenderedObject.Row:
                                Driver.rowContent(p.Context.Object, p, columnName);
                                break;
                            case Templating.RenderedObject.Cell:
                                Driver.cellContent(p.Context.Object, p);
                                break;
                            case Templating.RenderedObject.Line:
                                var line = p.Context.Object;
                                for (var i = 0; i < line.Rows.length; i++) {
                                    Driver.row(p, line.Rows[i]);
                                }
                                break;
                            default:
                                throw new Error('Unknown rendering context type');
                        }
                    }
                };
                Driver.row = function (p, row) {
                    p.nestElement(row, p.Executor.obtainRowTemplate(row), Templating.RenderedObject.Row);
                };
                Driver.line = function (p, ln) {
                    p.nestElement(ln, p.Executor.obtainLineTemplate(), Templating.RenderedObject.Line);
                };
                Driver.headerContent = function (head, p) {
                    var content = head.Column.Configuration.Title || head.Column.RawName;
                    p.w(content);
                };
                Driver.rowContent = function (row, p, columnName) {
                    var columns = p.UiColumns;
                    for (var i = 0; i < columns.length; i++) {
                        var c = row.Cells[columns[i].RawName];
                        if (columnName != null && columnName != undefined && typeof columnName == 'string') {
                            if (c.Column.RawName === columnName) {
                                Driver.cell(p, c);
                            }
                        }
                        else {
                            Driver.cell(p, c);
                        }
                    }
                };
                Driver.cell = function (p, cell) {
                    p.nestElement(cell, p.Executor.obtainCellTemplate(cell), Templating.RenderedObject.Cell);
                };
                Driver.cellContent = function (c, p) {
                    var tpl = p.Executor.ColumnRenderes[c.Column.RawName];
                    if (typeof tpl === "string") {
                        p.nest(c, c.Column.Configuration.CellRenderingTemplateId);
                    }
                    else {
                        p.w(tpl(c));
                    }
                };
                Driver.plugin = function (p, pluginPosition, pluginId) {
                    var plugin = p.Executor.Instances.getPlugin(pluginId, pluginPosition);
                    Driver.renderPlugin(p, plugin);
                };
                Driver.plugins = function (p, pluginPosition) {
                    var plugins = p.Executor.Instances.getPlugins(pluginPosition);
                    if (!plugins)
                        return;
                    var anyPlugins = false;
                    for (var i = 0; i < plugins.length; i++) {
                        if ((plugins[i].Configuration) && !plugins[i].Configuration.Hidden) {
                            anyPlugins = true;
                            break;
                        }
                    }
                    if (!anyPlugins)
                        return;
                    for (var a in plugins) {
                        if (plugins.hasOwnProperty(a)) {
                            var v = plugins[a];
                            Driver.renderPlugin(p, v);
                        }
                    }
                };
                Driver.renderPlugin = function (p, plugin) {
                    if (plugin.renderElement) {
                        p.d(plugin, Templating.RenderedObject.Plugin);
                        plugin.renderElement(p);
                        p.u();
                        return;
                    }
                    if (!plugin.renderContent)
                        return;
                    p.nest(plugin, p.Executor.CoreTemplateIds.PluginWrapper);
                };
                Driver.colHeader = function (p, columnName) {
                    try {
                        Driver.header(p, p.Executor.Instances.getColumn(columnName));
                    }
                    catch (a) {
                    }
                };
                Driver.header = function (p, column) {
                    if (column.Header.renderElement) {
                        p.d(column.Header, Templating.RenderedObject.Header);
                        column.Header.renderElement(p);
                        p.u();
                    }
                    else {
                        p.nest(column.Header, column.Header.TemplateIdOverride || p.Executor.CoreTemplateIds.HeaderWrapper);
                    }
                };
                Driver.headers = function (p) {
                    var columns = p.UiColumns;
                    for (var a in columns) {
                        if (columns.hasOwnProperty(a)) {
                            Driver.header(p, columns[a]);
                        }
                    }
                };
                return Driver;
            }());
            Templating.Driver = Driver;
        })(Templating = Lattice.Templating || (Lattice.Templating = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Templating;
        (function (Templating) {
            var _ltcTpl = (function () {
                function _ltcTpl() {
                }
                _ltcTpl._ = function (prefix, id, tpl) {
                    if (!_ltcTpl._lib[prefix])
                        _ltcTpl._lib[prefix] = { Prefix: prefix, Templates: {} };
                    _ltcTpl._lib[prefix].Templates[id] = tpl;
                };
                _ltcTpl.executor = function (prefix, table) {
                    if (!_ltcTpl._lib.hasOwnProperty(prefix)) {
                        throw new Error("Cannot find templates set with prefix " + prefix);
                    }
                    return new Templating.TemplatesExecutor(_ltcTpl._lib[prefix], table);
                };
                _ltcTpl._lib = {};
                return _ltcTpl;
            }());
            Templating._ltcTpl = _ltcTpl;
        })(Templating = Lattice.Templating || (Lattice.Templating = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Templating;
        (function (Templating) {
            var RenderingStack = (function () {
                function RenderingStack() {
                    this._contextStack = [];
                    this.Current = null;
                }
                RenderingStack.prototype.clear = function () {
                    this.Current = null;
                    if (this._contextStack.length === 0)
                        return;
                    this._contextStack = [];
                };
                RenderingStack.prototype.pushContext = function (ctx) {
                    this._contextStack.push(ctx);
                    this.Current = ctx;
                };
                RenderingStack.prototype.push = function (elementType, element) {
                    var ctx = {
                        Type: elementType,
                        Object: element,
                        CurrentTrack: this.getTrack(elementType, element),
                        IsTrackWritten: false,
                        TrackBuffer: ''
                    };
                    this._contextStack.push(ctx);
                    this.Current = ctx;
                };
                RenderingStack.prototype.getTrack = function (elementType, element) {
                    var trk;
                    switch (elementType) {
                        case Templating.RenderedObject.Plugin:
                            trk = Lattice.TrackHelper.getPluginTrack(element);
                            break;
                        case Templating.RenderedObject.Header:
                            trk = Lattice.TrackHelper.getHeaderTrack(element);
                            break;
                        case Templating.RenderedObject.Cell:
                            trk = Lattice.TrackHelper.getCellTrack(element);
                            break;
                        case Templating.RenderedObject.Row:
                            trk = Lattice.TrackHelper.getRowTrack(element);
                            break;
                        case Templating.RenderedObject.Message:
                            trk = Lattice.TrackHelper.getMessageTrack();
                            break;
                        case Templating.RenderedObject.Partition:
                            trk = Lattice.TrackHelper.getPartitionRowTrack();
                            break;
                        case Templating.RenderedObject.Line:
                            trk = Lattice.TrackHelper.getLineTrack(element);
                            break;
                        case Templating.RenderedObject.Custom:
                            trk = null;
                            break;
                        default:
                            throw new Error('Invalid context element type');
                    }
                    return trk;
                };
                RenderingStack.prototype.popContext = function () {
                    this._contextStack.pop();
                    if (this._contextStack.length === 0)
                        this.Current = null;
                    else
                        this.Current = this._contextStack[this._contextStack.length - 1];
                };
                return RenderingStack;
            }());
            Templating.RenderingStack = RenderingStack;
        })(Templating = Lattice.Templating || (Lattice.Templating = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
var Reinforced;
(function (Reinforced) {
    var Lattice;
    (function (Lattice) {
        var Templating;
        (function (Templating) {
            var TemplateProcess = (function () {
                function TemplateProcess(uiColumns, executor) {
                    this.Html = '';
                    this._stack = new Reinforced.Lattice.Templating.RenderingStack();
                    this.BackInfo = {
                        CachedVisualStates: {},
                        CallbacksQueue: [],
                        DatepickersQueue: [],
                        DestroyCallbacksQueue: [],
                        EventsQueue: [],
                        HasVisualStates: false,
                        MarkQueue: []
                    };
                    this.w = this.append.bind(this);
                    this.s = this.spaceW.bind(this);
                    this.UiColumns = uiColumns();
                    this.Executor = executor;
                }
                TemplateProcess.prototype.append = function (str) {
                    if (str == null || str == undefined)
                        return;
                    if (this.Context.CurrentTrack != null && !this.Context.IsTrackWritten) {
                        var strPiece = str.toString();
                        this.autotrack(strPiece);
                    }
                    else
                        this.Html += str.toString();
                };
                TemplateProcess.prototype.autotrack = function (str) {
                    this.Context.TrackBuffer += str;
                    var idx = this.findStartTag(this.Context.TrackBuffer);
                    if (idx < 0)
                        return;
                    if (idx === this.Context.TrackBuffer.length) {
                        this.Context.TrackBuffer += this.trackAttr();
                    }
                    else {
                        var head = this.Context.TrackBuffer.substr(0, idx);
                        var tail = this.Context.TrackBuffer.substring(idx, this.Context.TrackBuffer.length);
                        this.Context.TrackBuffer = head + this.trackAttr() + tail;
                    }
                    this.Html += this.Context.TrackBuffer;
                    this.Context.IsTrackWritten = true;
                };
                TemplateProcess.prototype.findStartTag = function (buf) {
                    var idx = buf.indexOf('<');
                    if (idx < 0)
                        return -1;
                    while ((idx + 1 < buf.length - 1) && (!TemplateProcess.alphaRegex.test(buf.charAt(idx + 1)))) {
                        idx = buf.indexOf('<', idx + 1);
                    }
                    if (idx < 0)
                        return -1;
                    idx++;
                    while ((idx < buf.length) && TemplateProcess.alphaRegex.test(buf.charAt(idx)))
                        idx++;
                    return idx;
                };
                TemplateProcess.prototype.nest = function (data, templateId) {
                    this.Executor.nest(data, templateId, this);
                };
                TemplateProcess.prototype.spc = function (num) {
                    if (this.Executor.Spaces[num])
                        return this.Executor.Spaces[num];
                    var r = '';
                    for (var i = 0; i < num; i++) {
                        r += ' ';
                    }
                    this.Executor[num] = r;
                    return r;
                };
                TemplateProcess.prototype.spaceW = function () {
                    for (var i = 0; i < arguments.length; i++) {
                        if (typeof arguments[i] === "number") {
                            this.w(this.spc(arguments[i]));
                        }
                        else {
                            this.w(arguments[i]);
                        }
                    }
                };
                TemplateProcess.prototype.nestElement = function (e, templateId, type) {
                    if (e.renderElement) {
                        this.d(e, type);
                        e.renderElement(this);
                        this.u();
                    }
                    else {
                        if (!templateId)
                            throw new Error('Renderable object must have either .renderElement implemented or templateId specified');
                        this.nest(e, templateId);
                    }
                };
                TemplateProcess.prototype.nestContent = function (e, templateId) {
                    if (e.renderContent) {
                        e.renderContent(this);
                    }
                    else {
                        if (!templateId)
                            throw new Error('Renderable object must have either .renderContent implemented or templateId specified');
                        this.nest(e, templateId);
                    }
                };
                TemplateProcess.prototype.d = function (model, type) {
                    this._stack.push(type, model);
                    this.Context = this._stack.Current;
                };
                TemplateProcess.prototype.u = function () {
                    this._stack.popContext();
                    if (!this._stack.Current) {
                        this.Context = null;
                    }
                    else {
                        this.Context = this._stack.Current;
                    }
                };
                TemplateProcess.prototype.vs = function (stateName, state) {
                    state.Receiver = this.Context.Object;
                    if (!this.BackInfo.CachedVisualStates[stateName])
                        this.BackInfo.CachedVisualStates[stateName] = [];
                    var index = this.BackInfo.CachedVisualStates[stateName].length;
                    this.BackInfo.CachedVisualStates[stateName].push(state);
                    this.BackInfo.HasVisualStates = true;
                    this.w("data-state-" + stateName + "=\"" + index + "\"");
                };
                TemplateProcess.prototype.e = function (commaSeparatedFunctions, event, eventArgs) {
                    var ed = {
                        EventReceiver: this.Context.Object,
                        Functions: commaSeparatedFunctions.split(','),
                        Event: event,
                        EventArguments: eventArgs
                    };
                    var index = this.BackInfo.EventsQueue.length;
                    this.BackInfo.EventsQueue.push(ed);
                    this.w("data-be-" + index + "=\"" + index + "\" data-evb=\"true\"");
                };
                TemplateProcess.prototype.rc = function (fn, args) {
                    var index = this.BackInfo.CallbacksQueue.length;
                    this.BackInfo.CallbacksQueue.push({
                        Callback: fn,
                        CallbackArguments: args,
                        Target: window
                    });
                    this.w("data-cb=\"" + index + "\"");
                };
                TemplateProcess.prototype.dc = function (fn, args) {
                    var index = this.BackInfo.DestroyCallbacksQueue.length;
                    this.BackInfo.DestroyCallbacksQueue.push({
                        Callback: fn,
                        CallbackArguments: args,
                        Target: window
                    });
                    this.w("data-dcb=\"" + index + "\"");
                };
                TemplateProcess.prototype.m = function (fieldName, key, receiverPath) {
                    var index = this.BackInfo.MarkQueue.length;
                    var receiver = this.Context.Object;
                    if (receiverPath != null) {
                        var tp = Reinforced.Lattice.Rendering.BackBinder.traverseWindowPath(receiverPath);
                        receiver = tp.target || tp.parent;
                    }
                    var md = {
                        ElementReceiver: receiver,
                        FieldName: fieldName,
                        Key: key
                    };
                    this.BackInfo.MarkQueue.push(md);
                    this.w("data-mrk=\"" + index + "\"");
                };
                TemplateProcess.prototype.dp = function (condition, nullable) {
                    var index = this.BackInfo.DatepickersQueue.length;
                    if (condition) {
                        var md = {
                            ElementReceiver: this.Context.Object,
                            IsNullable: nullable
                        };
                        this.BackInfo.DatepickersQueue.push(md);
                        this.w("data-dp=\"" + index + "\"");
                    }
                };
                TemplateProcess.prototype.trackAttr = function () {
                    var trk = this._stack.Current.CurrentTrack;
                    if (trk.length === 0)
                        return null;
                    var tra = "data-track=\"" + trk + "\"";
                    if (this.Context.Type === RenderedObject.Row || this.Context.Type === RenderedObject.Partition) {
                        if (this.Context.Object.IsSpecial) {
                            tra += " data-spr='true'";
                        }
                    }
                    return ' ' + tra + ' ';
                };
                TemplateProcess.prototype.isLoc = function (location) {
                    var loc = this.Context.Object['PluginLocation'];
                    if (loc.length < location.length)
                        return false;
                    if (loc.length === location.length && loc === location)
                        return true;
                    if (loc.substring(0, location.length) === location)
                        return true;
                    return false;
                };
                TemplateProcess.prototype.isLocation = function () {
                    if (this.Context.Type === RenderedObject.Plugin) {
                        for (var i = 0; i < arguments.length; i++) {
                            if (this.isLoc(arguments[i]))
                                return true;
                        }
                    }
                    return false;
                };
                TemplateProcess.alphaRegex = /[a-zA-Z]/;
                return TemplateProcess;
            }());
            Templating.TemplateProcess = TemplateProcess;
            var RenderedObject;
            (function (RenderedObject) {
                RenderedObject[RenderedObject["Plugin"] = 0] = "Plugin";
                RenderedObject[RenderedObject["Header"] = 1] = "Header";
                RenderedObject[RenderedObject["Row"] = 2] = "Row";
                RenderedObject[RenderedObject["Cell"] = 3] = "Cell";
                RenderedObject[RenderedObject["Message"] = 4] = "Message";
                RenderedObject[RenderedObject["Partition"] = 5] = "Partition";
                RenderedObject[RenderedObject["Line"] = 6] = "Line";
                RenderedObject[RenderedObject["Custom"] = 7] = "Custom";
            })(RenderedObject = Templating.RenderedObject || (Templating.RenderedObject = {}));
        })(Templating = Lattice.Templating || (Lattice.Templating = {}));
    })(Lattice = Reinforced.Lattice || (Reinforced.Lattice = {}));
})(Reinforced || (Reinforced = {}));
//# sourceMappingURL=reinforced.lattice.js.map