declare module Reinforced.Lattice {
    class ComponentsContainer {
        private static _components;
        static registerComponent(key: string, ctor: Function): void;
        static resolveComponent<T>(key: string, args?: any[]): T;
        static registerComponentEvents(key: string, eventsManager: Reinforced.Lattice.Services.EventsService, masterTable: IMasterTable): void;
        static registerAllEvents(eventsManager: Reinforced.Lattice.Services.EventsService, masterTable: IMasterTable): void;
    }
}
declare module Reinforced.Lattice.Templating {
    class TemplatesExecutor {
        private _lib;
        ColumnRenderes: {
            [key: string]: (x: ICell) => string;
        };
        CoreTemplateIds: ICoreTemplateIds;
        Instances: Reinforced.Lattice.Services.InstanceManagerService;
        private _master;
        private _uiColumns;
        constructor(lib: ITemplatesLib, masterTable: Reinforced.Lattice.IMasterTable);
        Spaces: {
            [_: number]: string;
        };
        private cacheColumnRenderers(columns);
        executeLayout(): ITemplateResult;
        beginProcess(): TemplateProcess;
        endProcess(tp: TemplateProcess): ITemplateResult;
        execute(data: any, templateId: string): ITemplateResult;
        nest(data: any, templateId: string, p: TemplateProcess): void;
        hasTemplate(templateId: string): boolean;
        obtainRowTemplate(rw: IRow): string;
        obtainLineTemplate(): string;
        obtainCellTemplate(cell: ICell): string;
    }
}
declare module Reinforced.Lattice {
    class TableEvent<TBeforeEventArgs, TAfterEventArgs> {
        constructor(masterTable: any);
        private _masterTable;
        private _beforeCount;
        private _afterCount;
        private _handlersAfter;
        private _handlersBefore;
        invokeBefore(thisArg: any, eventArgs: TBeforeEventArgs): void;
        invokeAfter(thisArg: any, eventArgs: TAfterEventArgs): void;
        invoke(thisArg: any, eventArgs: TAfterEventArgs): void;
        subscribeAfter(handler: (e: ITableEventArgs<TAfterEventArgs>) => any, subscriber: string): void;
        subscribe(handler: (e: ITableEventArgs<TAfterEventArgs>) => any, subscriber: string): void;
        subscribeBefore(handler: (e: ITableEventArgs<TBeforeEventArgs>) => any, subscriber: string): void;
        unsubscribe(subscriber: string): void;
        unsubscribeAfter(subscriber: string): void;
        unsubscribeBefore(subscriber: string): void;
    }
}
declare module Reinforced.Lattice.Services {
    class EventsService {
        private _masterTable;
        constructor(masterTable: any);
        LayoutRendered: TableEvent<any, any>;
        QueryGathering: TableEvent<IQueryGatheringEventArgs, IQueryGatheringEventArgs>;
        ClientQueryGathering: TableEvent<IQueryGatheringEventArgs, IQueryGatheringEventArgs>;
        Loading: TableEvent<ILoadingEventArgs, ILoadingEventArgs>;
        DeferredDataReceived: TableEvent<IDeferredDataEventArgs, any>;
        LoadingError: TableEvent<ILoadingErrorEventArgs, any>;
        ColumnsCreation: TableEvent<{
            [key: string]: IColumn;
        }, any>;
        DataReceived: TableEvent<IDataEventArgs, IDataEventArgs>;
        ClientDataProcessing: TableEvent<IQuery, IClientDataResults>;
        DataRendered: TableEvent<any, any>;
        Filtered: TableEvent<any[], any[]>;
        Ordered: TableEvent<any[], any[]>;
        Partitioned: TableEvent<any[], any[]>;
        registerEvent<TEventArgs>(eventName: string): void;
        SelectionChanged: TableEvent<{
            [primaryKey: string]: number[];
        }, {
            [primaryKey: string]: number[];
        }>;
        Adjustment: TableEvent<Reinforced.Lattice.ITableAdjustment, IAdjustmentResult>;
        AdjustmentRender: TableEvent<IAdjustmentResult, IAdjustmentResult>;
        PartitionChanged: TableEvent<IPartitionChangeEventArgs, IPartitionChangeEventArgs>;
        Edit: TableEvent<any, any>;
        EditValidationFailed: TableEvent<IEditValidationEvent, IEditValidationEvent>;
    }
}
declare module Reinforced.Lattice.Services {
    class EventsDelegatorService {
        constructor(locator: Reinforced.Lattice.Rendering.DOMLocator, bodyElement: HTMLElement, layoutElement: HTMLElement, rootId: string, masterTable: IMasterTable);
        static addHandler(element: HTMLElement, type: string, handler: any, useCapture?: boolean): void;
        static removeHandler(element: HTMLElement, type: string, handler: any, useCapture?: boolean): void;
        private _masterTable;
        private _rootId;
        private _locator;
        private _bodyElement;
        private _layoutElement;
        private _outSubscriptions;
        private _matches;
        private traverseAndFire(subscriptions, path, args);
        private ensureMouseOpSubscriptions();
        private checkMouseEvent(eventId);
        private _previousMousePos;
        private onMouseMoveEvent(e);
        private _domEvents;
        private _outEvents;
        private ensureEventSubscription(eventId);
        private ensureOutSubscription(eventId);
        private _cellDomSubscriptions;
        subscribeCellEvent(subscription: IUiSubscription<ICellEventArgs>): void;
        private _rowDomSubscriptions;
        subscribeRowEvent(subscription: IUiSubscription<IRowEventArgs>): void;
        private _directSubscriptions;
        subscribeEvent(el: HTMLElement, event: Reinforced.Lattice.DOMEvents.IDomEventJson, handler: any, receiver: any, eventArguments: any[]): void;
        subscribeOutOfElementEvent(el: HTMLElement, event: Reinforced.Lattice.DOMEvents.IDomEventJson, handler: any, receiver: any, eventArguments: any[]): void;
        subscribeDestroy(e: HTMLElement, callback: Reinforced.Lattice.Templating.IBackbindCallback): void;
        private onTableEvent(e);
        private onOutTableEvent(e);
        private _destroyCallbacks;
        handleElementDestroy(e: Element): void;
        private collectElementsHavingAttribute(parent, attribute);
    }
}
declare module Reinforced.Lattice {
    interface IPrecomputedRange {
        From: any;
        To: any;
        HasFrom: boolean;
        HasTo: boolean;
        IncludeLeft: boolean;
        IncludeRight: boolean;
    }
    interface IClientFilter {
        precompute(query: Reinforced.Lattice.IQuery, context: {
            [_: string]: any;
        }): void;
        filterPredicate(rowObject: any, context: {
            [_: string]: any;
        }, query: Reinforced.Lattice.IQuery): boolean;
    }
    interface IPlugin extends IRenderable {
        RawConfig: Reinforced.Lattice.IPluginConfiguration;
        PluginLocation: string;
        Order: number;
        init(masterTable: IMasterTable): void;
    }
    enum QueryScope {
        Server = 0,
        Client = 1,
        Transboundary = 2,
    }
    interface IQueryPartProvider {
        modifyQuery(query: IQuery, scope: QueryScope): void;
    }
    interface IRenderable {
        renderElement?: (templateProcess: Reinforced.Lattice.Templating.TemplateProcess) => void;
        renderContent?: (templateProcess: Reinforced.Lattice.Templating.TemplateProcess) => void;
    }
    interface ICell extends IRenderable {
        Row: IRow;
        Column: IColumn;
        Data: any;
        DataObject: any;
        TemplateIdOverride?: string;
        IsUpdated?: boolean;
        IsAdded?: boolean;
        IsSelected?: boolean;
    }
    interface IColumnHeader extends IRenderable {
        Column: IColumn;
        TemplateIdOverride?: string;
    }
    interface IRow extends IRenderable {
        DataObject: any;
        Index: number;
        MasterTable: IMasterTable;
        Cells: {
            [key: string]: ICell;
        };
        IsSpecial?: boolean;
        TemplateIdOverride?: string;
        IsSelected?: boolean;
        IsUpdated?: boolean;
        IsAdded?: boolean;
        CanBeSelected?: boolean;
        Command: ICommandExecutionParameters;
        DisplayIndex: number;
        IsLast: boolean;
    }
    interface ILine {
        Number: number;
        Rows: IRow[];
    }
    interface ITemplatesProvider {
        Executor: Reinforced.Lattice.Templating.TemplatesExecutor;
    }
    interface IColumn {
        RawName: string;
        Configuration: IColumnConfiguration;
        MasterTable: IMasterTable;
        Header: IColumnHeader;
        Order: number;
        UiOrder: number;
        IsDateTime: boolean;
        IsInteger: boolean;
        IsFloat: boolean;
        IsString: boolean;
        IsEnum: boolean;
        IsBoolean: boolean;
    }
    interface IUiMessage extends ILatticeMessage {
        UiColumnsCount: number;
        IsMessageObject?: boolean;
    }
    interface IEditValidationEvent {
        OriginalDataObject: any;
        ModifiedDataObject: any;
        ValidationMessages: Reinforced.Lattice.Editing.IValidationMessage[];
    }
    interface IClientDataResults {
        Source: any[];
        Filtered: any[];
        Ordered: any[];
        Displaying: any[];
        OnlyPartitionPerformed?: boolean;
    }
    interface ITableEventArgs<T> {
        MasterTable: IMasterTable;
        EventArgs: T;
        EventDirection: EventDirection;
    }
    enum EventDirection {
        Before = 0,
        After = 1,
        Undirected = 2,
    }
    interface ILoadingEventArgs {
        Request: ILatticeRequest;
        XMLHttp?: XMLHttpRequest;
    }
    interface ILoadingResponseEventArgs extends ILoadingEventArgs {
        Response: ILatticeResponse;
    }
    interface ILoadingErrorEventArgs extends ILoadingEventArgs {
        Reason: string;
    }
    interface IDeferredDataEventArgs extends ILoadingEventArgs {
        Token: string;
        DataUrl: string;
    }
    interface IDataEventArgs extends ILoadingEventArgs {
        Data: ILatticeResponse;
        IsAdjustment: boolean;
        Adjustments?: ITableAdjustment;
    }
    interface IQueryGatheringEventArgs {
        Query: IQuery;
        Scope: QueryScope;
    }
    interface IRowEventArgs {
        Master: IMasterTable;
        OriginalEvent: Event;
        Row: number;
        Stop: boolean;
    }
    interface ICellEventArgs extends IRowEventArgs {
        Column: number;
    }
    interface ISubscription {
        EventId: string;
        Selector?: string;
        SubscriptionId: string;
        Handler: any;
        filter: (e: UIEvent) => boolean;
    }
    interface IUiSubscription<TEventArgs> extends ISubscription {
        Handler: (e: TEventArgs) => any;
    }
    interface IAdjustmentResult {
        NeedRefilter: boolean;
        AddedData: any[];
        TouchedData: any[];
        TouchedColumns: string[][];
        NeedRedrawAll: boolean;
    }
    interface ILocalLookupResult {
        DataObject: any;
        IsCurrentlyDisplaying: boolean;
        LoadedIndex: number;
        DisplayedIndex: number;
    }
    interface IAdditionalDataReceiver {
        handleAdditionalData(additionalData: any): void;
    }
    interface ICommandExecutionParameters {
        CommandDescription: Reinforced.Lattice.Commands.ICommandDescription;
        Master: IMasterTable;
        Subject: any;
        Selection: any[];
        Confirmation: any;
        Result: any;
        confirm: () => void;
        dismiss: () => void;
        Details: any;
    }
    interface IAdditionalRowsProvider {
        provide(rows: IRow[]): void;
    }
    interface IPartitionChangeEventArgs {
        PreviousSkip: number;
        PreviousTake: number;
        Skip: number;
        Take: number;
        FloatingSkip: number;
        PreviousFloatingSkip: number;
    }
    interface ITemplateBoundEvent {
        Element: HTMLElement;
        EventObject: Event;
        Receiver: any;
        EventArguments: any[];
    }
}
declare module Reinforced.Lattice {
    class IeCheck {
        static ieVersion?: number;
        static detectIe(): void;
        static isIeGreater(version: number): boolean;
    }
}
declare module Reinforced.Lattice {
    interface IMasterTable {
        Events: Reinforced.Lattice.Services.EventsService;
        DataHolder: Reinforced.Lattice.Services.DataHolderService;
        Loader: Reinforced.Lattice.Services.LoaderService;
        Renderer: Rendering.Renderer;
        InstanceManager: Reinforced.Lattice.Services.InstanceManagerService;
        Controller: Reinforced.Lattice.Services.Controller;
        Date: Reinforced.Lattice.Services.DateService;
        Selection: Reinforced.Lattice.Services.SelectionService;
        proceedAdjustments(adjustments: Reinforced.Lattice.ITableAdjustment): void;
        MessageService: Reinforced.Lattice.Services.MessagesService;
        Commands: Reinforced.Lattice.Services.CommandsService;
        Partition: Reinforced.Lattice.Services.Partition.IPartitionService;
        Configuration: Reinforced.Lattice.ITableConfiguration;
        Stats: Reinforced.Lattice.IStatsModel;
        getStaticData(): any;
        setStaticData(obj: any): void;
    }
}
declare module Reinforced.Lattice {
    interface ITableConfiguration {
        EmptyFiltersPlaceholder: string;
        Prefix: string;
        TableRootId: string;
        OperationalAjaxUrl: string;
        LoadImmediately: boolean;
        DatepickerOptions: Reinforced.Lattice.IDatepickerOptions;
        Columns: Reinforced.Lattice.IColumnConfiguration[];
        PluginsConfiguration: Reinforced.Lattice.IPluginConfiguration[];
        StaticData: string;
        CoreTemplates: Reinforced.Lattice.ICoreTemplateIds;
        KeyFields: string[];
        CallbackFunction: (table: Reinforced.Lattice.IMasterTable) => void;
        TemplateSelector: (row: Reinforced.Lattice.IRow) => string;
        MessageFunction: (msg: Reinforced.Lattice.ILatticeMessage) => void;
        Subscriptions: Reinforced.Lattice.IConfiguredSubscriptionInfo[];
        QueryConfirmation: (query: Reinforced.Lattice.ILatticeRequest, scope: Reinforced.Lattice.QueryScope, continueFn: any) => void;
        SelectionConfiguration: Reinforced.Lattice.ISelectionConfiguration;
        PrefetchedData: any[];
        Commands: {
            [key: string]: Reinforced.Lattice.Commands.ICommandDescription;
        };
        Partition: Reinforced.Lattice.IPartitionConfiguration;
        Lines: Reinforced.Lattice.Configuration.Json.ILinesConfiguration;
    }
    interface IDatepickerOptions {
        CreateDatePicker: (element: HTMLElement, isNullableDate: boolean) => void;
        PutToDatePicker: (element: HTMLElement, date?: Date) => void;
        GetFromDatePicker: (element: HTMLElement) => Date;
        DestroyDatepicker: (element: HTMLElement) => void;
    }
    interface ICoreTemplateIds {
        Layout: string;
        PluginWrapper: string;
        RowWrapper: string;
        CellWrapper: string;
        HeaderWrapper: string;
        Line: string;
        ErrorMessage: string;
        NoResultsMessage: string;
        InitialMessage: string;
    }
    interface ILatticeMessage {
        Type: Reinforced.Lattice.MessageType;
        Title: string;
        Details: string;
        Class: string;
    }
    interface IColumnConfiguration {
        Title: string;
        DisplayOrder: number;
        Description: string;
        Meta?: any;
        RawColumnName: string;
        CellRenderingTemplateId: string;
        CellRenderingValueFunction: (a: any) => string;
        ColumnType: string;
        IsDataOnly: boolean;
        IsEnum: boolean;
        IsNullable: boolean;
        ClientValueFunction: (a: any) => any;
        TemplateSelector: (cell: Reinforced.Lattice.ICell) => string;
        IsSpecial: boolean;
    }
    interface IUiListItem {
        Text: string;
        Value: string;
        Selected: boolean;
        Disabled: boolean;
    }
    interface IPluginConfiguration {
        PluginId: string;
        Placement: string;
        Configuration: any;
        Order: number;
        TemplateId: string;
    }
    interface ILatticeResponse {
        Message: Reinforced.Lattice.ILatticeMessage;
        ResultsCount: number;
        BatchSize: number;
        PageIndex: number;
        Data: any[];
        AdditionalData: any;
        Success: boolean;
    }
    interface ILatticeRequest {
        Command: string;
        Query: Reinforced.Lattice.IQuery;
    }
    interface IQuery {
        Partition?: Reinforced.Lattice.IPartition;
        Orderings: {
            [key: string]: Reinforced.Lattice.Ordering;
        };
        Filterings: {
            [key: string]: string;
        };
        AdditionalData: {
            [key: string]: string;
        };
        StaticDataJson: string;
        Selection: {
            [key: string]: number[];
        };
        IsBackgroundDataFetch: boolean;
    }
    interface IPartition {
        Skip: number;
        Take: number;
        NoCount: boolean;
    }
    interface IConfiguredSubscriptionInfo {
        IsRowSubscription: boolean;
        ColumnName: string;
        Selector: string;
        DomEvent: Reinforced.Lattice.DOMEvents.IDomEventJson;
        Handler: (dataObject: any, originalEvent: any) => void;
    }
    interface ITableAdjustment {
        Message: Reinforced.Lattice.ILatticeMessage;
        IsUpdateResult: boolean;
        UpdatedData: any[];
        RemoveKeys: string[];
        OtherTablesAdjustments: {
            [key: string]: Reinforced.Lattice.ITableAdjustment;
        };
        RedrawAll: boolean;
        AdditionalData: any;
    }
    interface ISelectionConfiguration {
        SelectAllBehavior: Reinforced.Lattice.SelectAllBehavior;
        ResetSelectionBehavior: Reinforced.Lattice.ResetSelectionBehavior;
        CanSelectRowFunction: (dataObject: any) => boolean;
        CanSelectCellFunction: (dataObject: any, column: string, select: boolean) => boolean;
        NonselectableColumns: string[];
        SelectSingle: boolean;
        InitialSelected: {
            [key: string]: string[];
        };
    }
    interface IPartitionConfiguration {
        Type: Reinforced.Lattice.PartitionType;
        InitialSkip: number;
        InitialTake: number;
        BalancerFunction: (a: any) => void;
        Server: Reinforced.Lattice.IServerPartitionConfiguration;
        Sequential: Reinforced.Lattice.IServerPartitionConfiguration;
    }
    interface IPartitionRowData {
        UiColumnsCount: () => number;
        IsLoading: () => boolean;
        Stats: () => Reinforced.Lattice.IStatsModel;
        IsClientSearchPending: () => boolean;
        CanLoadMore: () => boolean;
        LoadAhead: () => number;
    }
    interface IStatsModel {
        IsSetFinite: () => boolean;
        Mode: () => Reinforced.Lattice.PartitionType;
        ServerCount: () => number;
        Stored: () => number;
        Filtered: () => number;
        Displayed: () => number;
        Ordered: () => number;
        Skip: () => number;
        Take: () => number;
        Pages: () => number;
        CurrentPage: () => number;
        IsAllDataLoaded: () => boolean;
    }
    interface IServerPartitionConfiguration {
        LoadAhead: number;
        UseLoadMore: boolean;
        AppendLoadingRow: boolean;
        LoadingRowTemplateId: string;
    }
    enum MessageType {
        UserMessage = 0,
        Banner = 1,
    }
    enum Ordering {
        Ascending = 0,
        Descending = 1,
        Neutral = 2,
    }
    enum SelectAllBehavior {
        AllVisible = 0,
        OnlyIfAllDataVisible = 1,
        AllLoadedData = 2,
        Disabled = 3,
    }
    enum ResetSelectionBehavior {
        DontReset = 0,
        ServerReload = 1,
        ClientReload = 2,
    }
    enum PartitionType {
        Client = 0,
        Server = 1,
        Sequential = 2,
    }
}
declare module Reinforced.Lattice.Configuration.Json {
    interface ILinesConfiguration {
        UseTemplate: boolean;
        RowsInLine: number;
    }
}
declare module Reinforced.Lattice.DOMEvents {
    interface IDomEventJson {
        DomEvents: string[];
        Out: boolean;
        Predicate: (e: UIEvent) => boolean;
    }
}
declare module Reinforced.Lattice.Plugins.Formwatch {
    interface IFormwatchClientConfiguration {
        DoNotEmbed: boolean;
        FieldsConfiguration: Reinforced.Lattice.Plugins.Formwatch.IFormwatchFieldData[];
        FiltersMappings: {
            [key: string]: Reinforced.Lattice.Plugins.Formwatch.IFormWatchFilteringsMappings;
        };
    }
    interface IFormwatchFieldData {
        FieldJsonName: string;
        FieldSelector: string;
        FieldValueFunction: () => any;
        TriggerSearchOnEvents: string[];
        ConstantValue: string;
        SearchTriggerDelay: number;
        SetConstantIfNotSupplied: boolean;
        AutomaticallyAttachDatepicker: boolean;
        IsDateTime: boolean;
        IsArray: boolean;
        IsBoolean: boolean;
        IsString: boolean;
        IsInteger: boolean;
        IsFloating: boolean;
        IsNullable: boolean;
        ArrayDelimiter: string;
        DoNotEmbed: boolean;
    }
    interface IFormWatchFilteringsMappings {
        FilterType: number;
        FieldKeys: string[];
        ForServer: boolean;
        ForClient: boolean;
    }
}
declare module Reinforced.Lattice.Plugins.Hideout {
    interface IHideoutPluginConfiguration {
        ShowMenu: boolean;
        HideableColumnsNames: string[];
        ColumnInitiatingReload: string[];
        HiddenColumns: {
            [key: string]: boolean;
        };
        DefaultTemplateId: string;
    }
}
declare module Reinforced.Lattice.Filters.Range {
    interface IRangeFilterUiConfig {
        ColumnName: string;
        FromPlaceholder: string;
        ToPlaceholder: string;
        InputDelay: number;
        FromValue: string;
        ToValue: string;
        ClientFiltering: boolean;
        ClientFilteringFunction: (object: any, entry: Reinforced.Lattice.IPrecomputedRange, query: IQuery) => boolean;
        CompareOnlyDates: boolean;
        Hidden: boolean;
        DefaultTemplateId: string;
        InclusiveLeft: boolean;
        InclusiveRight: boolean;
    }
}
declare module Reinforced.Lattice.Filters.Value {
    interface IValueFilterUiConfig {
        Placeholder: string;
        InputDelay: number;
        DefaultValue: string;
        ColumnName: string;
        ClientFiltering: boolean;
        ClientFilteringFunction: (object: any, filterValue: string, query: IQuery) => boolean;
        Hidden: boolean;
        CompareOnlyDates: boolean;
        DefaultTemplateId: string;
    }
}
declare module Reinforced.Lattice.Plugins.ResponseInfo {
    interface IResponseInfoClientConfiguration {
        ClientCalculators: {
            [key: string]: (data: Reinforced.Lattice.IClientDataResults) => any;
        };
        ClientTemplateFunction: (data: any) => string;
        ResponseObjectOverriden: boolean;
        DefaultTemplateId: string;
    }
}
declare module Reinforced.Lattice.Filters.Select {
    interface ISelectFilterUiConfig {
        SelectedValue: string;
        IsMultiple: boolean;
        ColumnName: string;
        Items: Reinforced.Lattice.IUiListItem[];
        Hidden: boolean;
        ClientFiltering: boolean;
        ClientFilteringFunction: (object: any, selectedValues: string[], query: Reinforced.Lattice.IQuery) => boolean;
        DefaultTemplateId: string;
    }
}
declare module Reinforced.Lattice.Plugins.Limit {
    interface ILimitClientConfiguration {
        LimitValues: number[];
        LimitLabels: string[];
        DefaultTemplateId: string;
    }
}
declare module Reinforced.Lattice.Plugins.Ordering {
    interface IOrderingConfiguration {
        OrderingsForColumns: {
            [key: string]: Reinforced.Lattice.Plugins.Ordering.IColumnOrderingConfiguration;
        };
        DefaultTemplateId: string;
        RadioOrdering: boolean;
    }
    interface IColumnOrderingConfiguration {
        DefaultOrdering: Reinforced.Lattice.Ordering;
        Hidden: boolean;
        Function: (a: any, b: any) => number;
        Priority: number;
        IsClient: boolean;
    }
}
declare module Reinforced.Lattice.Plugins.Paging {
    interface IPagingClientConfiguration {
        ArrowsMode: boolean;
        UsePeriods: boolean;
        PagesToHideUnderPeriod: number;
        UseFirstLastPage: boolean;
        UseGotoPage: boolean;
        DefaultTemplateId: string;
    }
}
declare module Reinforced.Lattice.Plugins.Toolbar {
    interface IToolbarButtonsClientConfiguration {
        Buttons: Reinforced.Lattice.Plugins.Toolbar.IToolbarButtonClientConfiguration[];
        DefaultTemplateId: string;
    }
    interface IToolbarButtonClientConfiguration {
        Id: string;
        Css: string;
        Style: string;
        HtmlContent: string;
        Command: string;
        BlackoutWhileCommand: boolean;
        DisableIfNothingChecked: boolean;
        Title: string;
        OnClick: (table: Reinforced.Lattice.IMasterTable, menuElement: any) => void;
        Submenu: Reinforced.Lattice.Plugins.Toolbar.IToolbarButtonClientConfiguration[];
        HasSubmenu: boolean;
        IsMenu: boolean;
        Separator: boolean;
        InternalId: number;
        IsDisabled: boolean;
    }
}
declare module Reinforced.Lattice.Plugins.Total {
    interface ITotalResponse {
        TotalsForColumns: {
            [key: string]: any;
        };
    }
    interface ITotalClientConfiguration {
        ShowOnTop: boolean;
        ColumnsValueFunctions: {
            [key: string]: (a: any) => string;
        };
        ColumnsCalculatorFunctions: {
            [key: string]: (data: Reinforced.Lattice.IClientDataResults) => any;
        };
    }
}
declare module Reinforced.Lattice.Editing {
    interface IEditFieldUiConfigBase {
        TemplateId: string;
        FieldName: string;
        PluginId: string;
        ValidationMessagesTemplateId: string;
        FakeColumn: Reinforced.Lattice.IColumnConfiguration;
        ValidationMessagesOverride: {
            [key: string]: string;
        };
    }
    interface IEditFormUiConfigBase {
        Fields: Reinforced.Lattice.Editing.IEditFieldUiConfigBase[];
    }
}
declare module Reinforced.Lattice.Editing.Cells {
    interface ICellsEditUiConfig extends Reinforced.Lattice.Editing.IEditFormUiConfigBase {
        BeginEditEventId: string;
    }
}
declare module Reinforced.Lattice.Editing.Form {
    interface IFormEditUiConfig extends Reinforced.Lattice.Editing.IEditFormUiConfigBase {
        FormTargetSelector: string;
        FormTemplateId: string;
    }
}
declare module Reinforced.Lattice.Editing.Rows {
    interface IRowsEditUiConfig extends Reinforced.Lattice.Editing.IEditFormUiConfigBase {
        BeginEditEventId: string;
        CommitEventId: string;
        RejectEventId: string;
    }
}
declare module Reinforced.Lattice.Editing.Editors.Display {
    interface IDisplayingEditorUiConfig extends Reinforced.Lattice.Editing.IEditFieldUiConfigBase {
        PluginId: string;
        Template: (cell: ICell) => string;
    }
}
declare module Reinforced.Lattice.Editing.Editors.SelectList {
    interface ISelectListEditorUiConfig extends Reinforced.Lattice.Editing.IEditFieldUiConfigBase {
        PluginId: string;
        SelectListItems: Reinforced.Lattice.IUiListItem[];
        AllowEmptyString: boolean;
        EmptyElementText: string;
        AddEmptyElement: boolean;
        MissingKeyFunction: (a: any) => any;
        MissingValueFunction: (a: any) => any;
    }
}
declare module Reinforced.Lattice.Editing.Editors.Memo {
    interface IMemoEditorUiConfig extends Reinforced.Lattice.Editing.IEditFieldUiConfigBase {
        PluginId: string;
        WarningChars: number;
        MaxChars: number;
        Rows: number;
        Columns: number;
        AllowEmptyString: boolean;
    }
}
declare module Reinforced.Lattice.Editing.Editors.Check {
    interface ICheckEditorUiConfig extends Reinforced.Lattice.Editing.IEditFieldUiConfigBase {
        PluginId: string;
        IsMandatory: boolean;
    }
}
declare module Reinforced.Lattice.Editing.Editors.PlainText {
    interface IPlainTextEditorUiConfig extends Reinforced.Lattice.Editing.IEditFieldUiConfigBase {
        PluginId: string;
        ValidationRegex: string;
        EnableBasicValidation: boolean;
        FormatFunction: (value: any, column: IColumn) => string;
        ParseFunction: (value: string, column: IColumn, errors: Reinforced.Lattice.Editing.IValidationMessage[]) => any;
        FloatRemoveSeparatorsRegex: string;
        FloatDotReplaceSeparatorsRegex: string;
        AllowEmptyString: boolean;
        MaxAllowedLength: number;
    }
}
declare module Reinforced.Lattice.Plugins.LoadingOverlap {
    interface ILoadingOverlapUiConfig {
        Overlaps: {
            [key: string]: string;
        };
        DefaultTemplateId: string;
    }
    enum OverlapMode {
        All = 0,
        BodyOnly = 1,
        Parent = 2,
    }
}
declare module Reinforced.Lattice.Plugins.Reload {
    interface IReloadUiConfiguration {
        ForceReload: boolean;
        RenderTo: string;
        DefaultTemplateId: string;
    }
}
declare module Reinforced.Lattice.Plugins.Hierarchy {
    interface IHierarchyUiConfiguration {
        ParentKeyFields: string[];
        ExpandBehavior: Reinforced.Lattice.Plugins.Hierarchy.NodeExpandBehavior;
        CollapsedNodeFilterBehavior: Reinforced.Lattice.Plugins.Hierarchy.TreeCollapsedNodeFilterBehavior;
    }
    enum NodeExpandBehavior {
        LoadFromCacheWhenPossible = 0,
        AlwaysLoadRemotely = 1,
    }
    enum TreeCollapsedNodeFilterBehavior {
        IncludeCollapsed = 0,
        ExcludeCollapsed = 1,
    }
}
declare module Reinforced.Lattice.Plugins.MouseSelect {
    interface IMouseSelectUiConfig {
    }
}
declare module Reinforced.Lattice.Plugins.Checkboxify {
    interface ICheckboxifyUiConfig {
        SelectAllTemplateId: string;
    }
}
declare module Reinforced.Lattice.Adjustments {
    interface ISelectionAdditionalData {
        SelectionToggle: Reinforced.Lattice.Adjustments.SelectionToggle;
        Unselect: {
            [key: string]: string[];
        };
        Select: {
            [key: string]: string[];
        };
    }
    interface IReloadAdditionalData {
        ForceServer: boolean;
        ReloadTableIds: string[];
    }
    enum SelectionToggle {
        LeaveAsIs = 0,
        All = 1,
        Nothing = 2,
    }
}
declare module Reinforced.Lattice.Plugins.RegularSelect {
    interface IRegularSelectUiConfig {
        Mode: Reinforced.Lattice.Plugins.RegularSelect.RegularSelectMode;
    }
    enum RegularSelectMode {
        Rows = 0,
        Cells = 1,
    }
}
declare module Reinforced.Lattice.Commands {
    interface ICommandDescription {
        Name: string;
        ServerName: string;
        ClientFunction: (param: ICommandExecutionParameters) => any;
        ConfirmationDataFunction: (param: ICommandExecutionParameters) => any;
        CanExecute: (data: {
            Subject: any;
            Master: IMasterTable;
        }) => boolean;
        Type: Reinforced.Lattice.Commands.CommandType;
        Confirmation: Reinforced.Lattice.Commands.IConfirmationConfiguration;
        OnSuccess: (param: ICommandExecutionParameters) => void;
        OnFailure: (param: ICommandExecutionParameters) => void;
        OnBeforeExecute: (param: ICommandExecutionParameters) => any;
    }
    interface IConfirmationConfiguration {
        TemplateId: string;
        TemplatePieces: {
            [_: string]: (param: ICommandExecutionParameters) => string;
        };
        TargetSelector: string;
        Formwatch: Reinforced.Lattice.Plugins.Formwatch.IFormwatchFieldData[];
        Autoform: Reinforced.Lattice.Commands.ICommandAutoformConfiguration;
        Details: Reinforced.Lattice.Commands.IDetailLoadingConfiguration;
        ContentLoadingUrl: (subject: any) => string;
        ContentLoadingMethod: string;
        ContentLoadingCommand: string;
        InitConfirmationObject: (confirmationObject: any, param: ICommandExecutionParameters, continuation: () => any) => void;
        OnDismiss: (param: ICommandExecutionParameters) => void;
        OnCommit: (param: ICommandExecutionParameters) => void;
        OnContentLoaded: (param: ICommandExecutionParameters) => void;
        OnDetailsLoaded: (param: ICommandExecutionParameters) => void;
    }
    interface ICommandAutoformConfiguration {
        Autoform: Reinforced.Lattice.Editing.IEditFieldUiConfigBase[];
        DisableWhenContentLoading: boolean;
        DisableWhileDetailsLoading: boolean;
    }
    interface IDetailLoadingConfiguration {
        CommandName: string;
        TempalteId: string;
        LoadImmediately: boolean;
        ValidateToLoad: (param: ICommandExecutionParameters) => boolean;
        DetailsFunction: (param: ICommandExecutionParameters) => any;
        LoadDelay: number;
        LoadOnce: boolean;
    }
    enum CommandType {
        Client = 0,
        Server = 1,
    }
}
declare module Reinforced.Lattice.Plugins.Scrollbar {
    interface IScrollbarPluginUiConfig {
        WheelEventsCatcher: string;
        KeyboardEventsCatcher: string;
        IsHorizontal: boolean;
        StickToElementSelector: string;
        StickDirection: Reinforced.Lattice.Plugins.Scrollbar.StickDirection;
        StickHollow: Reinforced.Lattice.Plugins.Scrollbar.StickHollow;
        DefaultTemplateId: string;
        Keys: Reinforced.Lattice.Plugins.Scrollbar.IScrollbarKeyMappings;
        Forces: Reinforced.Lattice.Plugins.Scrollbar.IScrollbarForces;
        PositionCorrector: any;
        UseTakeAsPageForce: boolean;
        ScrollerMinSize: number;
        ArrowsDelayMs: number;
        AppendToElement: string;
        FocusMode: Reinforced.Lattice.Plugins.Scrollbar.KeyboardScrollFocusMode;
        ScrollDragSmoothness: number;
    }
    interface IScrollbarKeyMappings {
        SingleUp: number[];
        SingleDown: number[];
        PageUp: number[];
        PageDown: number[];
        Home: number[];
        End: number[];
    }
    interface IScrollbarForces {
        WheelForce: number;
        SingleForce: number;
        PageForce: number;
    }
    enum StickDirection {
        Right = 0,
        Left = 1,
        Top = 2,
        Bottom = 3,
    }
    enum StickHollow {
        Internal = 0,
        External = 1,
    }
    enum KeyboardScrollFocusMode {
        Manual = 0,
        MouseOver = 1,
        MouseClick = 2,
    }
}
declare module Reinforced.Lattice.Plugins.NativeScroll {
    interface INativeScrollPluginUiConfig {
        IsHorizontal: boolean;
        ElementSize: number;
        ScrollThrottle: number;
    }
}
declare module Reinforced.Lattice {
    class Master implements IMasterTable {
        constructor(configuration: ITableConfiguration);
        private _isReady;
        private bindReady();
        private initialize();
        Date: Reinforced.Lattice.Services.DateService;
        reload(forceServer?: boolean, callback?: () => void): void;
        Events: Reinforced.Lattice.Services.EventsService;
        DataHolder: Reinforced.Lattice.Services.DataHolderService;
        Loader: Reinforced.Lattice.Services.LoaderService;
        Renderer: Rendering.Renderer;
        InstanceManager: Reinforced.Lattice.Services.InstanceManagerService;
        Controller: Reinforced.Lattice.Services.Controller;
        MessageService: Reinforced.Lattice.Services.MessagesService;
        Commands: Reinforced.Lattice.Services.CommandsService;
        Partition: Reinforced.Lattice.Services.Partition.IPartitionService;
        static fireDomEvent(eventName: string, element: HTMLElement): void;
        proceedAdjustments(adjustments: Reinforced.Lattice.ITableAdjustment): void;
        getStaticData(): any;
        setStaticData(obj: any): void;
        Selection: Reinforced.Lattice.Services.SelectionService;
        Configuration: ITableConfiguration;
        Stats: IStatsModel;
    }
}
declare module Reinforced.Lattice {
    class TrackHelper {
        static getCellTrack(cell: ICell): string;
        static getCellTrackByIndexes(rowIndex: number, columnIndex: number): string;
        static getPluginTrack(plugin: IPlugin): string;
        static getPluginTrackByLocation(pluginLocation: string): string;
        static getHeaderTrack(header: IColumnHeader): string;
        static getHeaderTrackByColumnName(columnName: string): string;
        static getRowTrack(row: IRow): string;
        static getLineTrack(line: ILine): string;
        static getLineTrackByIndex(lineNumber: number): string;
        static getRowTrackByObject(dataObject: any): string;
        static getMessageTrack(): string;
        static getPartitionRowTrack(): string;
        static getRowTrackByIndex(index: number): string;
        static getCellLocation(e: HTMLElement): ICellLocation;
        static getRowIndex(e: HTMLElement): number;
    }
    interface ICellLocation {
        RowIndex: number;
        ColumnIndex: number;
    }
}
declare module Reinforced.Lattice.Plugins {
    class PluginBase<TConfiguration> implements IPlugin {
        init(masterTable: IMasterTable): void;
        RawConfig: IPluginConfiguration;
        PluginLocation: string;
        VisualStates: Reinforced.Lattice.Rendering.VisualState;
        protected Configuration: TConfiguration;
        MasterTable: IMasterTable;
        protected subscribe(e: Reinforced.Lattice.Services.EventsService): void;
        protected afterDrawn: (e: ITableEventArgs<any>) => void;
        Order: number;
        defaultRender(p: Reinforced.Lattice.Templating.TemplateProcess): void;
    }
}
declare module Reinforced.Lattice.Editing {
    abstract class EditHandlerBase<TConfiguration extends Reinforced.Lattice.Editing.IEditFormUiConfigBase> extends Reinforced.Lattice.Plugins.PluginBase<TConfiguration> implements IEditHandler {
        Cells: {
            [key: string]: ICell;
        };
        DataObject: any;
        IsSpecial: boolean;
        Index: number;
        Command: Reinforced.Lattice.ICommandExecutionParameters;
        DisplayIndex: number;
        IsLast: boolean;
        protected CurrentDataObjectModified: any;
        protected ValidationMessages: IValidationMessage[];
        protected EditorConfigurations: {
            [key: string]: IEditFieldUiConfigBase;
        };
        commit(editor: Reinforced.Lattice.Editing.IEditor): void;
        notifyChanged(editor: Reinforced.Lattice.Editing.IEditor): void;
        reject(editor: Reinforced.Lattice.Editing.IEditor): void;
        protected dispatchEditResponse(editResponse: Reinforced.Lattice.ITableAdjustment, then: () => void): void;
        protected isEditable(column: IColumn): boolean;
        protected sendDataObjectToServer(then: () => void, errorCallback: (e: any) => void): void;
        protected hasChanges(): boolean;
        protected setEditorValue(editor: Reinforced.Lattice.Editing.IEditor): void;
        protected createEditor(fieldName: string, column: IColumn, canComplete: boolean, editorType: EditorMode): Reinforced.Lattice.Editing.IEditor;
        protected retrieveEditorData(editor: Reinforced.Lattice.Editing.IEditor, errors?: IValidationMessage[]): void;
        protected abstract onAdjustment(e: Reinforced.Lattice.ITableEventArgs<Reinforced.Lattice.IAdjustmentResult>): any;
        init(masterTable: IMasterTable): void;
        protected subscribe(e: Reinforced.Lattice.Services.EventsService): void;
    }
    interface IEditHandler extends IRow {
        commit(editor: Reinforced.Lattice.Editing.IEditor): void;
        notifyChanged(editor: Reinforced.Lattice.Editing.IEditor): void;
        reject(editor: Reinforced.Lattice.Editing.IEditor): void;
    }
    enum EditorMode {
        Cell = 0,
        Row = 1,
        Form = 2,
    }
}
declare module Reinforced.Lattice.Editing {
    class EditorBase<T extends Reinforced.Lattice.Editing.IEditFieldUiConfigBase> extends Reinforced.Lattice.Plugins.PluginBase<T> implements Reinforced.Lattice.Editing.IEditor {
        IsValid: boolean;
        CanComplete: boolean;
        IsRowEdit: boolean;
        IsFormEdit: boolean;
        IsCellEdit: boolean;
        DataObject: any;
        Data: any;
        ValidationMessages: IValidationMessage[];
        renderedValidationMessages(): string;
        protected getThisOriginalValue(): any;
        reset(): void;
        ModifiedDataObject: any;
        Row: IEditHandler;
        Column: IColumn;
        IsInitialValueSetting: boolean;
        getValue(errors: IValidationMessage[]): any;
        setValue(value: any): void;
        changedHandler(e: Reinforced.Lattice.ITemplateBoundEvent): void;
        commitHandler(e: Reinforced.Lattice.ITemplateBoundEvent): void;
        rejectHandler(e: Reinforced.Lattice.ITemplateBoundEvent): void;
        onAfterRender(e: HTMLElement): void;
        focus(): void;
        OriginalContent(p: Reinforced.Lattice.Templating.TemplateProcess): void;
        FieldName: string;
        notifyObjectChanged(): void;
        private _errorMessages;
        protected defineMessages(): {
            [key: string]: string;
        };
        getErrorMessage(key: string): string;
        init(masterTable: IMasterTable): void;
    }
    interface IEditor extends IPlugin, ICell {
        VisualStates: Reinforced.Lattice.Rendering.VisualState;
        DataObject: any;
        ModifiedDataObject: any;
        getValue(errors: IValidationMessage[]): any;
        setValue(value: any): void;
        Column: IColumn;
        FieldName: string;
        reset(): void;
        CanComplete: boolean;
        IsRowEdit: boolean;
        IsFormEdit: boolean;
        IsCellEdit: boolean;
        IsInitialValueSetting: boolean;
        onAfterRender(e: HTMLElement): void;
        IsValid: boolean;
        focus(): void;
        ValidationMessages: IValidationMessage[];
        notifyObjectChanged(): void;
        getErrorMessage(key: string): string;
    }
    interface IValidationMessage {
        Message?: string;
        Code: string;
    }
}
declare module Reinforced.Lattice.Editing.Editors.Cells {
    class CellsEditHandler extends EditHandlerBase<Reinforced.Lattice.Editing.Cells.ICellsEditUiConfig> implements IAdditionalRowsProvider {
        private _isEditing;
        private _activeEditor;
        DisplayIndex: number;
        IsLast: boolean;
        private ensureEditing(loadIndex);
        private beginCellEdit(column, rowIndex);
        beginCellEditHandle(e: ICellEventArgs): void;
        onAfterRender(e: any): void;
        afterDrawn: (e: ITableEventArgs<any>) => void;
        commit(editor: Reinforced.Lattice.Editing.IEditor): void;
        private finishEditing(editor, redraw);
        private cleanupAfterEdit();
        private _isRedrawnByAdjustment;
        protected onAdjustment(e: Reinforced.Lattice.ITableEventArgs<Reinforced.Lattice.IAdjustmentResult>): void;
        notifyChanged(editor: Reinforced.Lattice.Editing.IEditor): void;
        reject(editor: Reinforced.Lattice.Editing.IEditor): void;
        provide(rows: IRow[]): void;
        init(masterTable: IMasterTable): void;
    }
}
declare module Reinforced.Lattice.Editing.Editors.Check {
    class CheckEditor extends Reinforced.Lattice.Editing.EditorBase<Reinforced.Lattice.Editing.Editors.Check.ICheckEditorUiConfig> {
        FocusElement: HTMLElement;
        private _value;
        renderContent(p: Reinforced.Lattice.Templating.TemplateProcess): void;
        changedHandler(e: Reinforced.Lattice.ITemplateBoundEvent): void;
        private updateState();
        getValue(errors: Reinforced.Lattice.Editing.IValidationMessage[]): any;
        setValue(value: any): void;
        focus(): void;
        defineMessages(): {
            [key: string]: string;
        };
    }
}
declare module Reinforced.Lattice.Editing.Editors.Display {
    class DisplayEditor extends Reinforced.Lattice.Editing.EditorBase<Reinforced.Lattice.Editing.Editors.Display.IDisplayingEditorUiConfig> {
        ContentElement: HTMLElement;
        private _previousContent;
        renderContent(p: Reinforced.Lattice.Templating.TemplateProcess): void;
        Render(p: Reinforced.Lattice.Templating.TemplateProcess): void;
        notifyObjectChanged(): void;
        getValue(errors: Reinforced.Lattice.Editing.IValidationMessage[]): any;
        setValue(value: any): void;
        init(masterTable: IMasterTable): void;
    }
}
declare module Reinforced.Lattice.Editing.Editors.Memo {
    class MemoEditor extends Reinforced.Lattice.Editing.EditorBase<Reinforced.Lattice.Editing.Editors.Memo.IMemoEditorUiConfig> {
        TextArea: HTMLInputElement;
        MaxChars: number;
        CurrentChars: number;
        Rows: number;
        WarningChars: number;
        Columns: number;
        init(masterTable: IMasterTable): void;
        changedHandler(e: Reinforced.Lattice.ITemplateBoundEvent): void;
        setValue(value: any): void;
        getValue(errors: Reinforced.Lattice.Editing.IValidationMessage[]): any;
        renderContent(p: Reinforced.Lattice.Templating.TemplateProcess): void;
        focus(): void;
        defineMessages(): {
            [key: string]: string;
        };
    }
}
declare module Reinforced.Lattice.Editing.Editors.PlainText {
    class PlainTextEditor extends Reinforced.Lattice.Editing.EditorBase<Reinforced.Lattice.Editing.Editors.PlainText.IPlainTextEditorUiConfig> {
        Input: HTMLInputElement;
        ValidationRegex: RegExp;
        private _removeSeparators;
        private _dotSeparators;
        private _floatRegex;
        private _formatFunction;
        private _parseFunction;
        getValue(errors: Reinforced.Lattice.Editing.IValidationMessage[]): any;
        setValue(value: any): void;
        init(masterTable: IMasterTable): void;
        private defaultParse(value, column, errors);
        private defaultFormat(value, column);
        changedHandler(e: Reinforced.Lattice.ITemplateBoundEvent): void;
        renderContent(p: Reinforced.Lattice.Templating.TemplateProcess): void;
        focus(): void;
        defineMessages(): {
            [key: string]: string;
        };
    }
}
declare module Reinforced.Lattice.Editing.Editors.SelectList {
    class SelectListEditor extends Reinforced.Lattice.Editing.EditorBase<Reinforced.Lattice.Editing.Editors.SelectList.ISelectListEditorUiConfig> {
        List: HTMLSelectElement;
        Items: Reinforced.Lattice.IUiListItem[];
        SelectedItem: Reinforced.Lattice.IUiListItem;
        getValue(errors: Reinforced.Lattice.Editing.IValidationMessage[]): any;
        setValue(value: any): void;
        onStateChange(e: Reinforced.Lattice.Rendering.IStateChangedEvent): void;
        init(masterTable: IMasterTable): void;
        renderContent(p: Reinforced.Lattice.Templating.TemplateProcess): void;
        onAfterRender(e: HTMLElement): void;
        changedHandler(e: Reinforced.Lattice.ITemplateBoundEvent): void;
        focus(): void;
        defineMessages(): {
            [key: string]: string;
        };
    }
}
declare module Reinforced.Lattice.Editing.Form {
    class FormEditHandler extends Reinforced.Lattice.Editing.EditHandlerBase<Reinforced.Lattice.Editing.Form.IFormEditUiConfig> {
        private _currentForm;
        private _currentFormElement;
        private _activeEditors;
        private _isEditing;
        private ensureEditing(rowDisplayIndex);
        private ensureEditingObject(dataObject);
        add(): void;
        beginEdit(dataObject: any): void;
        beginFormEditHandler(e: IRowEventArgs): void;
        private startupForm();
        private stripNotRenderedEditors();
        commitAll(): void;
        rejectAll(): void;
        notifyChanged(editor: Reinforced.Lattice.Editing.IEditor): void;
        commit(editor: Reinforced.Lattice.Editing.IEditor): void;
        protected onAdjustment(e: Reinforced.Lattice.ITableEventArgs<Reinforced.Lattice.IAdjustmentResult>): void;
        reject(editor: Reinforced.Lattice.Editing.IEditor): void;
    }
    class FormEditFormModel {
        EditorsSet: {
            [key: string]: IEditor;
        };
        ActiveEditors: IEditor[];
        Handler: FormEditHandler;
        RootElement: HTMLElement;
        DataObject: any;
        Editors(p: Reinforced.Lattice.Templating.TemplateProcess): void;
        private editor(p, editor);
        Editor(p: Reinforced.Lattice.Templating.TemplateProcess, fieldName: string): void;
        commit(): void;
        reject(): void;
    }
}
declare module Reinforced.Lattice.Editing.Editors.Cells {
    class RowsEditHandler extends EditHandlerBase<Reinforced.Lattice.Editing.Rows.IRowsEditUiConfig> implements IAdditionalRowsProvider {
        DisplayIndex: number;
        private _isEditing;
        private _activeEditors;
        private _isAddingNewRow;
        IsLast: boolean;
        onAfterRender(e: any): void;
        private ensureEditing(rowIndex);
        private beginRowEdit(rowIndex);
        afterDrawn: (e: ITableEventArgs<any>) => void;
        commitAll(): void;
        commit(editor: Reinforced.Lattice.Editing.IEditor): void;
        notifyChanged(editor: Reinforced.Lattice.Editing.IEditor): void;
        rejectAll(): void;
        reject(editor: Reinforced.Lattice.Editing.IEditor): void;
        add(): void;
        beginRowEditHandle(e: IRowEventArgs): void;
        commitRowEditHandle(e: IRowEventArgs): void;
        rejectRowEditHandle(e: IRowEventArgs): void;
        provide(rows: IRow[]): void;
        private _isRedrawnByAdjustment;
        protected onAdjustment(e: Reinforced.Lattice.ITableEventArgs<Reinforced.Lattice.IAdjustmentResult>): void;
        init(masterTable: IMasterTable): void;
    }
}
declare module Reinforced.Lattice.Filters {
    class FilterBase<T> extends Reinforced.Lattice.Plugins.PluginBase<T> implements IQueryPartProvider, IClientFilter {
        precompute(query: Reinforced.Lattice.IQuery, context: {
            [index: string]: any;
        }): void;
        modifyQuery(query: IQuery, scope: QueryScope): void;
        init(masterTable: IMasterTable): void;
        protected itIsClientFilter(): void;
        filterPredicate(rowObject: any, context: {
            [index: string]: any;
        }, query: Reinforced.Lattice.IQuery): boolean;
    }
}
declare module Reinforced.Lattice.Filters.Range {
    class RangeFilterPlugin extends Reinforced.Lattice.Filters.FilterBase<Filters.Range.IRangeFilterUiConfig> {
        private _filteringIsBeingExecuted;
        private _inpTimeout;
        private _fromPreviousValue;
        private _toPreviousValue;
        AssociatedColumn: IColumn;
        private _isInitializing;
        FromValueProvider: HTMLInputElement;
        ToValueProvider: HTMLInputElement;
        private getFromValue();
        private getToValue();
        handleValueChanged(): void;
        getFilterArgument(): string;
        modifyQuery(query: IQuery, scope: QueryScope): void;
        init(masterTable: IMasterTable): void;
        renderContent(p: Reinforced.Lattice.Templating.TemplateProcess): void;
        precompute(query: Reinforced.Lattice.IQuery, context: {
            [index: string]: any;
        }): void;
        filterPredicate(rowObject: any, context: {
            [index: string]: any;
        }, query: IQuery): boolean;
        afterDrawn: (e: any) => void;
    }
}
declare module Reinforced.Lattice.Filters.Select {
    class SelectFilterPlugin extends Reinforced.Lattice.Filters.FilterBase<Filters.Select.ISelectFilterUiConfig> {
        FilterValueProvider: HTMLSelectElement;
        AssociatedColumn: IColumn;
        getSerializedValue(): string;
        getArrayValue(): string[];
        modifyQuery(query: IQuery, scope: QueryScope): void;
        renderContent(p: Reinforced.Lattice.Templating.TemplateProcess): void;
        handleValueChanged(): void;
        init(masterTable: IMasterTable): void;
        precompute(query: Reinforced.Lattice.IQuery, context: {
            [index: string]: any;
        }): void;
        filterPredicate(rowObject: any, context: {
            [index: string]: any;
        }, query: IQuery): boolean;
    }
}
declare module Reinforced.Lattice.Filters.Value {
    class ValueFilterPlugin extends Reinforced.Lattice.Filters.FilterBase<Filters.Value.IValueFilterUiConfig> {
        private _filteringIsBeingExecuted;
        private _inpTimeout;
        private _previousValue;
        AssociatedColumn: IColumn;
        private _isInitializing;
        FilterValueProvider: HTMLInputElement;
        getValue(): string;
        handleValueChanged(): void;
        renderContent(p: Reinforced.Lattice.Templating.TemplateProcess): void;
        init(masterTable: IMasterTable): void;
        precompute(query: Reinforced.Lattice.IQuery, context: {
            [index: string]: any;
        }): void;
        filterPredicate(rowObject: any, context: {
            [index: string]: any;
        }, query: Reinforced.Lattice.IQuery): boolean;
        modifyQuery(query: IQuery, scope: QueryScope): void;
        afterDrawn: (e: any) => void;
    }
}
declare module Reinforced.Lattice.Plugins.Checkboxify {
    class CheckboxifyPlugin extends Reinforced.Lattice.Plugins.PluginBase<Reinforced.Lattice.Plugins.Checkboxify.ICheckboxifyUiConfig> {
        private _ourColumn;
        private redrawHeader();
        init(masterTable: IMasterTable): void;
        subscribe(e: Reinforced.Lattice.Services.EventsService): void;
    }
}
declare module Reinforced.Lattice.Plugins.Formwatch {
    class FormwatchPlugin extends Reinforced.Lattice.Plugins.PluginBase<Reinforced.Lattice.Plugins.Formwatch.IFormwatchClientConfiguration> implements IQueryPartProvider {
        private _existingValues;
        private _filteringExecuted;
        private _timeouts;
        private _configurations;
        private static extractValueFromMultiSelect(o);
        private static extractInputValue(element, fieldConf, dateService);
        private static extractData(elements, fieldConf, dateService);
        static extractFormData(configuration: Reinforced.Lattice.Plugins.Formwatch.IFormwatchFieldData[], rootElement: any, dateService: Reinforced.Lattice.Services.DateService): {};
        modifyQuery(query: IQuery, scope: QueryScope): void;
        subscribe(e: Reinforced.Lattice.Services.EventsService): void;
        fieldChange(fieldSelector: string, delay: number, element: HTMLInputElement, e: Event): void;
        init(masterTable: IMasterTable): void;
    }
}
declare module Reinforced.Lattice.Plugins.Hideout {
    interface IColumnState {
        Visible: boolean;
        DoesNotExists: boolean;
        Column: IColumn;
    }
    class HideoutPlugin extends Reinforced.Lattice.Plugins.PluginBase<Reinforced.Lattice.Plugins.Hideout.IHideoutPluginConfiguration> implements IQueryPartProvider {
        ColumnStates: IColumnState[];
        private _columnStates;
        private _isInitializing;
        isColumnVisible(columnName: string): boolean;
        isColumnInstanceVisible(col: IColumn): boolean;
        hideColumnByName(rawColname: string): void;
        showColumnByName(rawColname: string): void;
        toggleColumn(e: Reinforced.Lattice.ITemplateBoundEvent): void;
        showColumn(e: Reinforced.Lattice.ITemplateBoundEvent): void;
        hideColumn(e: Reinforced.Lattice.ITemplateBoundEvent): void;
        toggleColumnByName(columnName: string): boolean;
        modifyQuery(query: IQuery, scope: QueryScope): void;
        hideColumnInstance(c: IColumn): void;
        showColumnInstance(c: IColumn): void;
        private onBeforeDataRendered();
        private onDataRendered();
        private onLayourRendered();
        init(masterTable: IMasterTable): void;
        renderContent(p: Reinforced.Lattice.Templating.TemplateProcess): void;
        subscribe(e: Reinforced.Lattice.Services.EventsService): void;
        isColVisible(columnName: string): boolean;
    }
}
declare module Reinforced.Lattice.Plugins.Hierarchy {
    class HierarchyPlugin extends Reinforced.Lattice.Plugins.PluginBase<IHierarchyUiConfiguration> implements IClientFilter {
        private _parentKeyFunction;
        private _globalHierarchy;
        private _currentHierarchy;
        private _notInHierarchy;
        init(masterTable: IMasterTable): void;
        expandRow(args: IRowEventArgs): void;
        expandLoadRow(args: IRowEventArgs): void;
        toggleLoadRow(args: IRowEventArgs): void;
        collapseRow(args: IRowEventArgs): void;
        toggleRow(args: IRowEventArgs): void;
        toggleSubtreeOrLoad(dataObject: any, turnOpen?: boolean): void;
        toggleSubtreeByObject(dataObject: any, turnOpen?: boolean): void;
        private loadRow(dataObject);
        private isParentExpanded(dataObject);
        private expand(dataObject);
        private appendNodes(newNodes, tail);
        private firePartitionChange(tk?, sk?, fsk?);
        private removeNLastRows(n);
        private toggleVisibleChildren(dataObject, visible, hierarchy?);
        private toggleVisible(dataObject, visible, hierarchy?);
        private collapse(dataObject, redraw);
        private onFiltered_after();
        private expandParents(src);
        private restoreHierarchyData(d);
        private buildCurrentHierarchy(d);
        private addParents(o, existing);
        private onOrdered_after();
        private orderHierarchy(src, minDeepness);
        private appendChildren(target, index, hierarchy);
        private buildHierarchy(d, minDeepness);
        private isParentNull(dataObject);
        private deepness(obj);
        private visible(obj);
        private onDataReceived_after(e);
        private setServerChildrenCount(dataObject);
        private setLocalChildrenCount(dataObject);
        private setChildrenCount(dataObject, count);
        private proceedAddedData(added);
        private proceedUpdatedData(d);
        moveItems(items: any[], newParent: any): void;
        private moveItem(dataObject, newParentKey);
        private moveFromNotInHierarchy(key, newParentKey);
        private cleanupNotInHierarchy();
        private onAdjustment_after(e);
        private onAdjustment_before(e);
        private moveToNotInHierarchy(parent);
        private removeFromHierarchySubtrees(toRemove, hierarchy);
        subscribe(e: Reinforced.Lattice.Services.EventsService): void;
        precompute(query: Reinforced.Lattice.IQuery, context: {
            [index: string]: any;
        }): void;
        filterPredicate(rowObject: any, context: {
            [index: string]: any;
        }, query: IQuery): boolean;
    }
}
declare module Reinforced.Lattice.Plugins.Limit {
    class LimitPlugin extends Reinforced.Lattice.Plugins.PluginBase<Plugins.Limit.ILimitClientConfiguration> {
        SelectedValue: ILimitSize;
        private _limitSize;
        Sizes: ILimitSize[];
        renderContent(p: Reinforced.Lattice.Templating.TemplateProcess): void;
        changeLimitHandler(e: Reinforced.Lattice.ITemplateBoundEvent): void;
        changeLimit(take: number): void;
        private onPartitionChange(e);
        init(masterTable: IMasterTable): void;
        subscribe(e: Reinforced.Lattice.Services.EventsService): void;
    }
    interface ILimitSize {
        IsSeparator: boolean;
        Value: number;
        Label: string;
    }
}
declare module Reinforced.Lattice.Plugins.LoadingOverlap {
    class LoadingOverlapPlugin extends Reinforced.Lattice.Plugins.PluginBase<Reinforced.Lattice.Plugins.LoadingOverlap.ILoadingOverlapUiConfig> {
        private _overlapInstances;
        private _isOverlapped;
        private overlapAll();
        private createOverlap(efor, templateId);
        private updateCoords(overlapLayer, overlapElement);
        private updateCoordsAll();
        private deoverlap();
        private onBeforeLoading(e);
        afterDrawn: (e: ITableEventArgs<any>) => void;
    }
}
declare module Reinforced.Lattice.Plugins.Loading {
    class LoadingPlugin extends Reinforced.Lattice.Plugins.PluginBase<any> implements ILoadingPlugin {
        BlinkElement: HTMLElement;
        subscribe(e: Reinforced.Lattice.Services.EventsService): void;
        showLoadingIndicator(): void;
        hideLoadingIndicator(): void;
        static Id: string;
        renderContent(p: Reinforced.Lattice.Templating.TemplateProcess): void;
    }
    interface ILoadingPlugin {
        showLoadingIndicator(): void;
        hideLoadingIndicator(): void;
    }
}
declare module Reinforced.Lattice.Plugins.MouseSelect {
    class MouseSelectPlugin extends Reinforced.Lattice.Plugins.PluginBase<Reinforced.Lattice.Plugins.MouseSelect.IMouseSelectUiConfig> {
        init(masterTable: IMasterTable): void;
        private originalX;
        private originalY;
        private selectPane;
        private _isSelecting;
        private selectStart(x, y);
        private move(x, y);
        private selectEnd();
        private _isAwaitingSelection;
        afterDrawn: (e: ITableEventArgs<any>) => void;
    }
}
declare module Reinforced.Lattice.Plugins.NativeScroll {
    class NativeScrollPlugin extends Reinforced.Lattice.Plugins.PluginBase<Reinforced.Lattice.Plugins.NativeScroll.INativeScrollPluginUiConfig> {
        private _before;
        private _after;
        private _scrollContainer;
        private _previousAmout;
        private adjustScrollerHeight(skip?);
        private totalSize();
        private afterSize(skip);
        private beforeSize(skip);
        private _block;
        private szBefore(size?);
        private szAfter(size?);
        private sz(element, size?);
        private _prevCount;
        private _isHidden;
        private hideScroll();
        private showScroll();
        init(masterTable: Reinforced.Lattice.IMasterTable): void;
        private time;
        private prevPos;
        private onScroll(e);
        private onPartitionChange(e);
        private onClientDataProcessing(e);
        subscribe(e: Reinforced.Lattice.Services.EventsService): void;
        private _onScrollBound;
        private onLayoutRendered(e);
    }
}
declare module Reinforced.Lattice.Plugins.Ordering {
    class OrderingPlugin extends Reinforced.Lattice.Filters.FilterBase<IOrderingConfiguration> {
        private _clientOrderings;
        private _serverOrderings;
        private _boundHandler;
        subscribe(e: Reinforced.Lattice.Services.EventsService): void;
        private overrideHeadersTemplates(columns);
        private updateOrdering(columnName, ordering);
        private specifyOrdering(object, ordering);
        private isClient(columnName);
        switchOrderingForColumn(columnName: string): void;
        private updateOrderingWithUi(columnName, ordering);
        setOrderingForColumn(columnName: string, ordering: Reinforced.Lattice.Ordering): void;
        protected nextOrdering(currentOrdering: Reinforced.Lattice.Ordering): Reinforced.Lattice.Ordering;
        private makeDefaultOrderingFunction(fieldName);
        init(masterTable: IMasterTable): void;
        private mixinOrderings(orderingsCollection, query);
        modifyQuery(query: IQuery, scope: QueryScope): void;
    }
}
declare module Reinforced.Lattice.Plugins.Paging {
    class PagingPlugin extends Reinforced.Lattice.Plugins.PluginBase<Plugins.Paging.IPagingClientConfiguration> {
        Pages: IPagesElement[];
        Shown: boolean;
        NextArrow: boolean;
        PrevArrow: boolean;
        CurrentPage(): number;
        TotalPages(): number;
        PageSize(): number;
        GotoInput: HTMLInputElement;
        goToPage(page: string): void;
        gotoPageClick(e: Reinforced.Lattice.ITemplateBoundEvent): void;
        navigateToPage(e: Reinforced.Lattice.ITemplateBoundEvent): void;
        nextClick(e: Reinforced.Lattice.ITemplateBoundEvent): void;
        previousClick(e: Reinforced.Lattice.ITemplateBoundEvent): void;
        private constructPagesElements();
        renderContent(p: Reinforced.Lattice.Templating.TemplateProcess): void;
        validateGotopage(): void;
        init(masterTable: IMasterTable): void;
        private onPartitionChanged(e);
        private onClientDataProcessing(e);
        subscribe(e: Reinforced.Lattice.Services.EventsService): void;
    }
    interface IPagesElement {
        Prev?: boolean;
        Period?: boolean;
        ActivePage?: boolean;
        Page: number;
        First?: boolean;
        Last?: boolean;
        Next?: boolean;
        InActivePage?: boolean;
        DisPage?: () => string;
    }
}
declare module Reinforced.Lattice.Plugins.RegularSelect {
    class RegularSelectPlugin extends Reinforced.Lattice.Plugins.PluginBase<Reinforced.Lattice.Plugins.RegularSelect.IRegularSelectUiConfig> {
        init(masterTable: IMasterTable): void;
        private _isSelecting;
        private _reset;
        private _startRow;
        private _startColumn;
        private _endRow;
        private _endColumn;
        private _prevUiCols;
        startSelection(e: ICellEventArgs): void;
        endSelection(e: ICellEventArgs): void;
        private diff(row, column);
        move(e: ICellEventArgs): void;
    }
}
declare module Reinforced.Lattice.Plugins.Reload {
    class ReloadPlugin extends Reinforced.Lattice.Plugins.PluginBase<Reinforced.Lattice.Plugins.Reload.IReloadUiConfiguration> {
        private _renderedExternally;
        private _externalReloadBtn;
        private _ready;
        triggerReload(): void;
        renderContent(p: Reinforced.Lattice.Templating.TemplateProcess): void;
        startLoading(): void;
        stopLoading(): void;
        subscribe(e: Reinforced.Lattice.Services.EventsService): void;
        init(masterTable: IMasterTable): void;
        afterDrawn: (e: ITableEventArgs<any>) => void;
    }
}
declare module Reinforced.Lattice.Plugins.ResponseInfo {
    class ResponseInfoPlugin extends Reinforced.Lattice.Plugins.PluginBase<Plugins.ResponseInfo.IResponseInfoClientConfiguration> implements Reinforced.Lattice.IAdditionalDataReceiver {
        private _recentData;
        private _recentServerData;
        private _recentTemplate;
        private _pagingEnabled;
        private _pagingPlugin;
        private _isServerRequest;
        private _isReadyForRendering;
        onResponse(e: ITableEventArgs<IDataEventArgs>): void;
        private addClientData(e);
        onClientDataProcessed(e: ITableEventArgs<IClientDataResults>): void;
        renderContent(p: Reinforced.Lattice.Templating.TemplateProcess): void;
        init(masterTable: IMasterTable): void;
        handleAdditionalData(additionalData: any): void;
    }
}
declare module Reinforced.Lattice.Plugins.Scrollbar {
    class ScrollbarPlugin extends Reinforced.Lattice.Plugins.PluginBase<Reinforced.Lattice.Plugins.Scrollbar.IScrollbarPluginUiConfig> {
        IsVertical: boolean;
        UpArrow: HTMLElement;
        DownArrow: HTMLElement;
        Scroller: HTMLElement;
        ScrollerActiveArea: HTMLElement;
        private _stickElement;
        private _scrollWidth;
        private _scrollHeight;
        private _scollbar;
        private _availableSpace;
        private _scrollerPos;
        private _scrollerSize;
        private _kbListener;
        private _wheelListener;
        private _boundScrollerMove;
        private _boundScrollerEnd;
        init(masterTable: IMasterTable): void;
        private _needUpdateCoords;
        updatePosition(): void;
        private adjustScrollerPosition(skip);
        private _availableSpaceRaw;
        private _availableSpaceRawCorrection;
        private _previousAmout;
        private adjustScrollerHeight();
        private calculateAvailableSpace();
        private getCoords();
        private getElement(configSelect);
        private onLayoutRendered(e);
        private subscribeUiEvents();
        private trackKbListenerClick(e);
        private isKbListenerHidden();
        private _kbActive;
        private enableKb();
        private disableKb();
        private static _forbiddenNodes;
        private keydownHook(e);
        private handleKey(keyCode);
        activeAreaClick(e: MouseEvent): void;
        activeAreaMouseDown(e: MouseEvent): void;
        private _mouseStartPos;
        private _startSkip;
        private scrollerStart(e);
        private _skipOnUp;
        private scrollerMove(e);
        private scrollerEnd(e);
        private handleWheel(e);
        private _upArrowActive;
        private _upArrowInterval;
        private upArrowStart(e);
        private upArrow();
        private upArrowEnd(e);
        private _downArrowActive;
        private _downArrowInterval;
        private downArrowStart(e);
        private downArrow();
        private downArrowEnd(e);
        private _moveCheckInterval;
        private startDeferring();
        private deferScroll(skip);
        private _needMoveTo;
        private _movedTo;
        private moveCheck();
        private endDeferring();
        private _prevCount;
        private _isHidden;
        private _isHiddenForcibly;
        private hideScroll(force?);
        private showScroll(force?);
        private onPartitionChange(e);
        private onClientDataProcessing(e);
        subscribe(e: Reinforced.Lattice.Services.EventsService): void;
        private _sensor;
    }
}
declare module Reinforced.Lattice.Plugins.Toolbar {
    class ToolbarPlugin extends Reinforced.Lattice.Plugins.PluginBase<Plugins.Toolbar.IToolbarButtonsClientConfiguration> {
        AllButtons: {
            [id: number]: HTMLElement;
        };
        private _buttonsConfig;
        buttonHandleEvent(e: Reinforced.Lattice.ITemplateBoundEvent): void;
        private redrawMe();
        private handleButtonAction(btn);
        renderContent(p: Reinforced.Lattice.Templating.TemplateProcess): void;
        private traverseButtons(arr);
        private onSelectionChanged(e);
        init(masterTable: IMasterTable): void;
    }
}
declare module Reinforced.Lattice.Plugins.Total {
    class TotalsPlugin extends Reinforced.Lattice.Plugins.PluginBase<Plugins.Total.ITotalClientConfiguration> implements Reinforced.Lattice.IAdditionalDataReceiver, Reinforced.Lattice.IAdditionalRowsProvider {
        private _totalsForColumns;
        private makeTotalsRow();
        private onAdjustments(e);
        onClientDataProcessed(e: ITableEventArgs<IClientDataResults>): void;
        subscribe(e: Reinforced.Lattice.Services.EventsService): void;
        handleAdditionalData(additionalData: any): void;
        init(masterTable: IMasterTable): void;
        provide(rows: IRow[]): void;
    }
}
declare module Reinforced.Lattice.Rendering {
    class BackBinder {
        private _dateService;
        Delegator: Reinforced.Lattice.Services.EventsDelegatorService;
        constructor(dateService: Reinforced.Lattice.Services.DateService);
        backBind(parentElement: HTMLElement, info: Reinforced.Lattice.Templating.IBackbindInfo): void;
        private traverseBackbind<T>(elements, parentElement, backbindCollection, attribute, fn);
        private getMatchingElements(parent, attr);
        private backbindDatepickers(parentElement, info);
        private backbindMark(parentElement, info);
        private backbindCallbacks(parentElement, info);
        private backbindEvents(parentElement, info);
        private evalCallback(calbackString);
        static traverseWindowPath(path: string): {
            target: any;
            parent: any;
        };
        private backbindVisualStates(parentElement, info);
        private resolveNormalStates(targets);
        private addNormalState(states, target);
        private mixinToNormal(normal, custom);
    }
}
declare module Reinforced.Lattice.Rendering {
    class DOMLocator {
        constructor(bodyElement: HTMLElement, rootElement: HTMLElement, rootId: string);
        private _bodyElement;
        private _rootElement;
        private _rootIdPrefix;
        getCellElement(cell: ICell): Element;
        getCellElementByIndex(rowDisplayIndex: number, columnIndex: number): Element;
        getRowElement(row: IRow): Element;
        getRowElementByObject(dataObject: any): Element;
        getPartitionRowElement(): Element;
        getRowElements(): NodeList;
        getLineElements(): NodeList;
        getRowElementByIndex(rowDisplayingIndex: number): Element;
        getLineElementByIndex(lineDisplayingIndex: number): Element;
        getColumnCellsElements(column: IColumn): NodeList;
        getColumnCellsElementsByColumnIndex(columnIndex: number): NodeList;
        getRowCellsElements(row: IRow): NodeList;
        getRowCellsElementsByIndex(rowDisplayingIndex: number): NodeList;
        getHeaderElement(header: IColumnHeader): Element;
        getPluginElement(plugin: IPlugin): Element;
        getPluginElementsByPositionPart(placement: string): NodeList;
        isRow(e: Element): boolean;
        isSpecialRow(e: Element): boolean;
        isCell(e: Element): boolean;
    }
}
declare module Reinforced.Lattice.Rendering {
    class DOMModifier {
        constructor(executor: Reinforced.Lattice.Templating.TemplatesExecutor, locator: DOMLocator, backBinder: BackBinder, instances: Reinforced.Lattice.Services.InstanceManagerService, ed: Reinforced.Lattice.Services.EventsDelegatorService, bodyElement: HTMLElement);
        private _tpl;
        private _ed;
        private _locator;
        private _backBinder;
        private _instances;
        private _bodyElement;
        destroyPartitionRow(): void;
        private getRealDisplay(elem);
        private displayCache;
        hideElement(el: Element): void;
        showElement(el: Element): void;
        cleanSelector(targetSelector: string): void;
        cleanElement(parent: Element): void;
        destroyElement(element: Element): void;
        private destroyElements(elements);
        hideElements(element: NodeList): void;
        showElements(element: NodeList): void;
        redrawPlugin(plugin: IPlugin): HTMLElement;
        renderPlugin(plugin: IPlugin): HTMLElement;
        redrawPluginsByPosition(position: string): void;
        hidePlugin(plugin: IPlugin): void;
        showPlugin(plugin: IPlugin): void;
        destroyPlugin(plugin: IPlugin): void;
        hidePluginsByPosition(position: string): void;
        showPluginsByPosition(position: string): void;
        destroyPluginsByPosition(position: string): void;
        redrawRow(row: IRow): HTMLElement;
        destroyRowByObject(dataObject: any): void;
        destroyRow(row: IRow): void;
        hideRow(row: IRow): void;
        showRow(row: IRow): void;
        appendRow(row: IRow, beforeRowAtIndex?: number): HTMLElement;
        appendLine(line: ILine, beforeLineAtIndex?: number): HTMLElement;
        prependLine(line: ILine): HTMLElement;
        prependRow(row: IRow): HTMLElement;
        destroyRowByIndex(rowDisplayIndex: number): void;
        destroyLineByIndex(lineDisplayIndex: number): void;
        destroyRowByNumber(rowNumber: number): void;
        hideRowByIndex(rowDisplayIndex: number): void;
        showRowByIndex(rowDisplayIndex: number): void;
        redrawCell(cell: ICell): HTMLElement;
        destroyCell(cell: ICell): void;
        hideCell(cell: ICell): void;
        showCell(cell: ICell): void;
        destroyCellsByColumn(column: IColumn): void;
        hideCellsByColumn(column: IColumn): void;
        showCellsByColumn(column: IColumn): void;
        destroyColumnCellsElementsByColumnIndex(columnIndex: number): void;
        hideColumnCellsElementsByColumnIndex(columnIndex: number): void;
        showColumnCellsElementsByColumnIndex(columnIndex: number): void;
        redrawHeader(column: IColumn): HTMLElement;
        destroyHeader(column: IColumn): void;
        hideHeader(column: IColumn): void;
        showHeader(column: IColumn): void;
        createElement(html: string): HTMLElement;
        createElementFromTemplate(templateId: string, viewModelBehind: any): HTMLElement;
        private replaceElement(element, html);
    }
}
declare module Reinforced.Lattice.Rendering.Html2Dom {
    class HtmlParserDefinitions {
        static startTag: RegExp;
        static endTag: RegExp;
        static attr: RegExp;
        static empty: {
            [index: string]: boolean;
        };
        static block: {
            [index: string]: boolean;
        };
        static inline: {
            [index: string]: boolean;
        };
        static closeSelf: {
            [index: string]: boolean;
        };
        static fillAttrs: {
            [index: string]: boolean;
        };
        static special: {
            [index: string]: boolean;
        };
        private static makeMap(str);
    }
    class HtmlParser {
        constructor();
        private _parseStartBound;
        private _parseEndBound;
        private _stack;
        private parse(html);
        private parseStartTag(tag, tagName, rest, unary);
        private parseEndTag(tag?, tagName?);
        private _curParentNode;
        private _elems;
        private _topNodes;
        private start(tagName, attrs, unary);
        private end(tag);
        private chars(text);
        html2Dom(html: string): HTMLElement;
        html2DomElements(html: string): Node[];
    }
}
declare module Reinforced.Lattice.Rendering {
    class Renderer implements ITemplatesProvider {
        constructor(rootId: string, prefix: string, masterTable: IMasterTable);
        private _columnsRenderFunctions;
        Executor: Reinforced.Lattice.Templating.TemplatesExecutor;
        RootElement: HTMLElement;
        BodyElement: HTMLElement;
        Locator: DOMLocator;
        BackBinder: BackBinder;
        Modifier: DOMModifier;
        Delegator: Reinforced.Lattice.Services.EventsDelegatorService;
        private _masterTable;
        private _instances;
        private _rootId;
        private _events;
        private _prefix;
        layout(): void;
        body(rows: IRow[]): void;
        renderObjectContent(renderable: IRenderable): string;
        renderToString(templateId: string, viewModelBehind: any): string;
        renderObject(templateId: string, viewModelBehind: any, targetSelector: string): HTMLElement;
        renderObjectTo(templateId: string, viewModelBehind: any, target: HTMLElement): HTMLElement;
        clearBody(): void;
    }
}
declare module Reinforced.Lattice.Rendering {
    class Resensor {
        constructor(element: HTMLElement, handler: () => any);
        private requestAnimationFrame;
        private _resizeBoud;
        private _handler;
        private _sensor;
        private _expandChild;
        private _expand;
        private _shrink;
        private _lastWidth;
        private _lastHeight;
        private _newWidth;
        private _newHeight;
        private _dirty;
        private _element;
        private _rafId;
        attach(): void;
        private onResized();
        private onScroll();
        private reset();
        private static getComputedStyle(element, prop);
    }
}
declare module Reinforced.Lattice.Rendering {
    class VisualState {
        constructor();
        States: {
            [key: string]: Reinforced.Lattice.Templating.IState[];
        };
        Current: string;
        private _subscribers;
        private _stopEvents;
        subscribeStateChange(fn: (evt: IStateChangedEvent) => void): void;
        private fireHandlers(e);
        changeState(state: string): void;
        mixinState(state: string): void;
        unmixinState(state: string): void;
        normalState(): void;
        private applyState(desired);
        private getContent(receiver, contentLocation);
        private setNormal();
    }
    interface IStateChangedEvent {
        State: string;
        CurrentState: string;
        StateWasMixedIn: boolean;
    }
}
declare module Reinforced.Lattice.Services {
    class CommandsService {
        constructor(masterTable: IMasterTable);
        private _masterTable;
        private _commandsCache;
        canExecute(commandName: string, subject?: any): boolean;
        triggerCommandOnRow(commandName: string, rowIndex: number, callback?: ((params: ICommandExecutionParameters) => void)): void;
        triggerCommand(commandName: string, subject: any, callback?: ((params: ICommandExecutionParameters) => void)): void;
        private redrawSubjectRow(subject, command);
        private restoreSubjectRow(subject);
        triggerCommandWithConfirmation(commandName: string, subject: any, confirmation: any, callback?: ((params: ICommandExecutionParameters) => void)): void;
    }
    class ConfirmationWindowViewModel implements Reinforced.Lattice.Editing.IEditHandler {
        Command: Reinforced.Lattice.ICommandExecutionParameters;
        DisplayIndex: number;
        IsLast: boolean;
        constructor(masterTable: IMasterTable, commandDescription: Reinforced.Lattice.Commands.ICommandDescription, subject: any, originalCallback: ((params: ICommandExecutionParameters) => void));
        init(continuation: Function): void;
        private initContinuation(tplParams, continuation);
        RootElement: HTMLElement;
        ContentPlaceholder: HTMLElement;
        DetailsPlaceholder: HTMLElement;
        TemplatePieces: {
            [_: string]: string;
        };
        VisualStates: Reinforced.Lattice.Rendering.VisualState;
        Subject: any;
        Selection: any[];
        RecentDetails: {
            Data: any;
        };
        private _detailsLoaded;
        private _commandDescription;
        private _config;
        private _embedBound;
        private _editorObjectModified;
        private _editorColumn;
        private _originalCallback;
        private _autoformFields;
        rendered(): void;
        private stripNotRenderedEditors();
        private loadContent();
        private contentLoaded();
        private loadContentByUrl(url, method);
        private _loadDetailsTimeout;
        private loadDetails();
        private loadDetailsInternal();
        private detailsLoaded(detailsResult);
        private embedConfirmation(q);
        private collectCommandParameters();
        private _isloadingContent;
        private getConfirmation();
        private initFormWatchDatepickers(parent);
        confirm(): void;
        dismiss(): void;
        EditorsSet: {
            [key: string]: Reinforced.Lattice.Editing.IEditor;
        };
        ActiveEditors: Reinforced.Lattice.Editing.IEditor[];
        Editors(p: Reinforced.Lattice.Templating.TemplateProcess): void;
        private editor(p, editor);
        Editor(p: Reinforced.Lattice.Templating.TemplateProcess, fieldName: string): void;
        private createEditor(fieldName, column);
        defaultValue(col: IColumn): any;
        private produceAutoformColumns(autoform);
        private initAutoform(autoform);
        DataObject: any;
        Index: number;
        MasterTable: IMasterTable;
        Cells: {
            [index: string]: ICell;
        };
        ValidationMessages: Reinforced.Lattice.Editing.IValidationMessage[];
        notifyChanged(editor: Reinforced.Lattice.Editing.IEditor): void;
        reject(editor: Reinforced.Lattice.Editing.IEditor): void;
        commit(editor: Reinforced.Lattice.Editing.IEditor): void;
        private retrieveEditorData(editor, errors?);
        protected setEditorValue(editor: Reinforced.Lattice.Editing.IEditor): void;
        private collectAutoForm();
    }
}
declare module Reinforced.Lattice.Services {
    class Controller implements IAdditionalDataReceiver {
        constructor(masterTable: IMasterTable);
        private _masterTable;
        private _additionalRowsProviders;
        registerAdditionalRowsProvider(provider: IAdditionalRowsProvider): void;
        reload(forceServer?: boolean, callback?: () => void): void;
        redrawVisibleDataObject(dataObject: any): HTMLElement;
        redrawVisibleData(): void;
        replaceVisibleData(rows: IRow[]): void;
        redrawVisibleCells(dataObject: any, columns: IColumn[]): void;
        redrawColumns(columns: IColumn[]): void;
        drawAdjustmentResult(adjustmentResult: IAdjustmentResult): void;
        produceCell(dataObject: any, column: IColumn, row: IRow): ICell;
        produceRow(dataObject: any, columns?: IColumn[]): IRow;
        produceRowsFromData(data: any[]): IRow[];
        produceRows(): IRow[];
        handleAdditionalData(additionalData: Reinforced.Lattice.Adjustments.IReloadAdditionalData): void;
        add(dataObject: any): any;
        remove(dataObject: any): any;
    }
}
declare module Reinforced.Lattice.Services {
    class DataHolderService {
        constructor(masterTable: IMasterTable);
        private _configuration;
        private _hasPrimaryKey;
        private _rawColumnNames;
        private _orderings;
        private _filters;
        private _anyClientFiltration;
        private _events;
        private _instances;
        private _masterTable;
        private _clientValueFunction;
        private _manadatoryOrderings;
        private _pkDataCache;
        DisplayedData: any[];
        StoredData: any[];
        Filtered: any[];
        Ordered: any[];
        registerClientFilter(filter: IClientFilter): void;
        PrimaryKeyFunction: (x: any) => string;
        DataObjectComparisonFunction: (x: any, y: any) => boolean;
        StoredCache: {
            [_: number]: any;
        };
        RecentClientQuery: IQuery;
        getClientFilters(): IClientFilter[];
        clearClientFilters(): void;
        registerClientOrdering(dataField: string, comparator: (a: any, b: any) => number, mandatory?: boolean, priority?: number): void;
        private isClientFiltrationPending();
        compileKeyFunction(keyFields: string[]): (x: any) => string;
        private compileComparisonFunction();
        deserializeData(source: any[]): any[];
        private getNextNonSpecialColumn(currentColIndex);
        storeResponse(response: ILatticeResponse, clientQuery: IQuery): void;
        filterSet(objects: any[], query: IQuery): any[];
        satisfyCurrentFilters(obj: any): boolean;
        private satisfyFilters(obj, query);
        orderWithCurrentOrderings(set: any[]): any[];
        orderSet(objects: any[], query: IQuery): any[];
        filterStoredData(query: IQuery, serverCount: number): void;
        filterStoredDataWithPreviousQuery(): void;
        localLookup(predicate: (object: any) => boolean, setToLookup?: any[]): ILocalLookupResult[];
        localLookupDisplayedDataObject(dataObject: any): ILocalLookupResult;
        localLookupStoredDataObject(dataObject: any): ILocalLookupResult;
        localLookupStoredData(index: number): ILocalLookupResult;
        getByPrimaryKeyObject(primaryKeyPart: any): any;
        getByPrimaryKey(primaryKey: string): any;
        localLookupPrimaryKey(dataObject: any, setToLookup?: any[]): ILocalLookupResult;
        defaultObject(): any;
        add(dataObject: any): any;
        remove(dataObject: any): void;
        detachByKey(key: string): void;
        detach(dataObject: any): void;
        private copyData(source, target);
        private _conter;
        private internalKey(obj, attach?, offset?);
        private resetCounter();
        proceedAdjustments(adjustments: Reinforced.Lattice.ITableAdjustment): IAdjustmentResult;
    }
}
declare module Reinforced.Lattice.Services {
    class DateService {
        constructor(datepickerOptions: IDatepickerOptions);
        private _datepickerOptions;
        private ensureDpo();
        isValidDate(date: Date): boolean;
        serialize(date?: Date): string;
        private static pad(x);
        parse(dateString: string): Date;
        getDateFromDatePicker(element: HTMLElement): Date;
        createDatePicker(element: HTMLElement, isNullableDate?: boolean): void;
        destroyDatePicker(element: HTMLElement): void;
        putDateToDatePicker(element: HTMLElement, date: Date): void;
    }
}
declare module Reinforced.Lattice.Services {
    class InstanceManagerService {
        constructor(configuration: ITableConfiguration, masterTable: IMasterTable, events: Reinforced.Lattice.Services.EventsService);
        Columns: {
            [key: string]: IColumn;
        };
        Plugins: {
            [key: string]: IPlugin;
        };
        private _events;
        private _configuration;
        private _rawColumnNames;
        private _masterTable;
        private _isHandlingSpecialPlacementCase;
        private _specialCasePlaceholder;
        private static _datetimeTypes;
        private static _stringTypes;
        private static _floatTypes;
        private static _integerTypes;
        private static _booleanTypes;
        static classifyType(fieldType: string): IClassifiedType;
        private initColumns();
        static createColumn(cnf: IColumnConfiguration, masterTable: IMasterTable, order?: number): IColumn;
        initPlugins(): void;
        private static startsWith(s1, prefix);
        private static endsWith(s1, postfix);
        _subscribeConfiguredEvents(): void;
        getPlugin<TPlugin>(pluginId: string, placement?: string): TPlugin;
        getPlugins(placement: string): IPlugin[];
        getColumnFilter<TPlugin>(columnName: string): TPlugin;
        getColumnNames(): string[];
        getUiColumnNames(): string[];
        getUiColumns(): IColumn[];
        getColumn(columnName: string): IColumn;
        getColumnByOrder(columnOrder: number): IColumn;
    }
    interface IClassifiedType {
        IsDateTime: boolean;
        IsString: boolean;
        IsFloat: boolean;
        IsInteger: boolean;
        IsBoolean: boolean;
        IsNullable: boolean;
    }
}
declare module Reinforced.Lattice.Services {
    class LoaderService {
        constructor(staticData: any, masterTable: IMasterTable);
        private _queryPartProviders;
        private _additionalDataReceivers;
        private _staticData;
        private _events;
        private _dataHolder;
        private _isFirstTimeLoading;
        private _masterTable;
        registerQueryPartProvider(provider: IQueryPartProvider): void;
        registerAdditionalDataReceiver(dataKey: string, receiver: IAdditionalDataReceiver): void;
        prefetchData(data: any[]): void;
        gatherQuery(queryScope: QueryScope): IQuery;
        private _previousRequest;
        createXmlHttp(): any;
        private _runningBackgroundRequests;
        private cancelBackground();
        private getXmlHttp(backgroupd);
        private _previousQueryString;
        private checkError(json, data);
        private checkMessage(json);
        private checkAdditionalData(json);
        private checkAdjustment(json, data);
        private handleRegularJsonResponse(responseText, data, clientQuery, callback, errorCallback);
        private handleDeferredResponse(responseText, data, callback);
        isLoading(): boolean;
        private doServerQuery(data, clientQuery, callback, errorCallback?);
        private _isLoading;
        query(callback: (data: any) => void, queryModifier?: (a: IQuery) => IQuery, errorCallback?: (data: any) => void, force?: boolean): void;
        private doClientQuery(clientQuery, callback);
        command(command: string, callback: (data: any) => void, queryModifier?: (a: IQuery) => IQuery, errorCallback?: (data: any) => void, force?: boolean): void;
    }
}
declare module Reinforced.Lattice.Services {
    class MessagesService implements IAdditionalRowsProvider {
        constructor(usersMessageFn: (msg: ILatticeMessage) => void, instances: Reinforced.Lattice.Services.InstanceManagerService, controller: Controller, templatesProvider: ITemplatesProvider, coreTemplates: Reinforced.Lattice.ICoreTemplateIds);
        private _coreTemplate;
        private _usersMessageFn;
        private _instances;
        private _controller;
        private _templatesProvider;
        showMessage(message: ILatticeMessage): void;
        private showTableMessage(tableMessage);
        private _noresultsOverrideRow;
        overrideNoresults(row: IRow): void;
        provide(rows: IRow[]): void;
    }
}
declare module Reinforced.Lattice.Services {
    class SelectionService implements IQueryPartProvider, IAdditionalDataReceiver {
        constructor(masterTable: IMasterTable);
        private _configuration;
        private _masterTable;
        private _selectionData;
        isSelected(dataObject: any): boolean;
        isAllSelected(): boolean;
        canSelect(dataObject: any): boolean;
        canSelectAll(): boolean;
        resetSelection(): void;
        toggleAll(selected?: boolean): void;
        isCellSelected(dataObject: any, column: IColumn): boolean;
        hasSelectedCells(dataObject: any): boolean;
        getSelectedCells(dataObject: any): number[];
        getSelectedCellsByPrimaryKey(dataObject: any): boolean;
        isSelectedPrimaryKey(primaryKey: string): boolean;
        toggleRow(primaryKey: string, select?: boolean): void;
        toggleDisplayingRow(rowIndex: number, selected?: boolean): void;
        toggleObjectSelected(dataObject: any, selected?: boolean): void;
        handleAdjustments(added: any[], removeKeys: string[]): void;
        modifyQuery(query: IQuery, scope: QueryScope): void;
        getSelectedKeys(): string[];
        getSelectedObjects(): any[];
        getSelectedColumns(primaryKey: string): IColumn[];
        getSelectedColumnsByObject(dataObject: any): IColumn[];
        toggleCellsByDisplayIndex(displayIndex: number, columnNames: string[], select?: boolean): void;
        toggleCellsByObject(dataObject: any, columnNames: string[], select?: boolean): void;
        toggleCells(primaryKey: string, columnNames: string[], select?: boolean): void;
        setCellsByDisplayIndex(displayIndex: number, columnNames: string[]): void;
        setCellsByObject(dataObject: any, columnNames: string[]): void;
        setCells(primaryKey: string, columnNames: string[]): void;
        handleAdditionalData(additionalData: any): void;
    }
}
declare module Reinforced.Lattice.Services {
    class StatsService implements Reinforced.Lattice.IStatsModel {
        constructor(master: IMasterTable);
        private _master;
        IsSetFinite(): boolean;
        Mode(): PartitionType;
        ServerCount(): number;
        Stored(): number;
        Filtered(): number;
        Displayed(): number;
        Ordered(): number;
        Skip(): number;
        Take(): number;
        Pages(): number;
        CurrentPage(): number;
        IsAllDataLoaded(): boolean;
    }
}
declare module Reinforced.Lattice.Services.Partition {
    class BackgroundDataLoader {
        constructor(masterTable: IMasterTable, conf: Reinforced.Lattice.IServerPartitionConfiguration);
        private _masterTable;
        private _dataAppendError;
        Indicator: PartitionIndicatorRow;
        LoadAhead: number;
        AppendLoadingRow: boolean;
        FinishReached: boolean;
        IsLoadingNextPart: boolean;
        UseLoadMore: boolean;
        Skip: number;
        Take: number;
        skipTake(skip: number, take: number): void;
        provideIndicator(rows: IRow[]): void;
        private _afterFn;
        loadNextDataPart(pages?: number, after?: any): void;
        private loadNextCore(pages?, show?);
        private dataAppendError(data);
        private modifyDataAppendQuery(q, pages);
        private static any(o);
        private dataAppendLoaded(data, pagesRequested, show);
        ClientSearchParameters: boolean;
        private _indicationShown;
        showIndication(): void;
        destroyIndication(): void;
        loadMore(show: boolean, page?: number): void;
    }
}
declare module Reinforced.Lattice.Services.Partition {
    class ClientPartitionService implements IPartitionService {
        constructor(masterTable: IMasterTable);
        protected _masterTable: IMasterTable;
        setSkip(skip: number, preserveTake?: boolean): void;
        private scrollLines(skip, take, prevSkip);
        private scrollRows(skip, take, prevSkip);
        private firstNonSpecialIndex(rows);
        private lastNonSpecialIndex(rows);
        protected displayedIndexes(): number[];
        setTake(take: number): void;
        protected restoreSpecialRows(rows: IRow[]): void;
        protected destroySpecialRows(rows: IRow[]): number;
        partitionBeforeQuery(serverQuery: IQuery, clientQuery: IQuery, isServerQuery: boolean): boolean;
        partitionBeforeCommand(serverQuery: IQuery): void;
        protected beforeSkipTake(skip?: number, floatingSkip?: number, take?: number): void;
        protected adjustSkipTake(skip?: number, floatingSkip?: number, take?: number): void;
        partitionAfterQuery(initialSet: any[], query: IQuery, serverCount: number): any[];
        protected skipTakeSet(ordered: any[], query: IQuery): any[];
        protected cut(ordered: any[], skip: number, take: number): any[];
        protected cutDisplayed(skip: number, take: number): void;
        Skip: number;
        FloatingSkip: number;
        Take: number;
        amount(): number;
        lines(): number;
        isAmountFinite(): boolean;
        totalAmount(): number;
        initial(skip: number, take: number): any;
        isClient(): boolean;
        isServer(): boolean;
        hasEnoughDataToSkip(skip: number): boolean;
        protected any(o: any): boolean;
        Type: PartitionType;
    }
}
declare module Reinforced.Lattice.Services.Partition {
    interface IPartitionService {
        Skip: number;
        FloatingSkip: number;
        Take: number;
        setSkip(skip: number, preserveTake?: boolean): void;
        setTake(take?: number): void;
        partitionBeforeQuery(serverQuery: IQuery, clientQuery: IQuery, isServerQuery: boolean): boolean;
        partitionBeforeCommand(serverQuery: IQuery): void;
        partitionAfterQuery(initialSet: any[], query: IQuery, serverCount: number): any[];
        amount(): number;
        lines(): number;
        isAmountFinite(): boolean;
        totalAmount(): number;
        initial(skip: number, take: number): any;
        isClient(): boolean;
        isServer(): boolean;
        hasEnoughDataToSkip(skip: number): boolean;
        Type: Reinforced.Lattice.PartitionType;
    }
}
declare module Reinforced.Lattice.Services.Partition {
    class PartitionIndicatorRow implements IRow {
        Command: Reinforced.Lattice.ICommandExecutionParameters;
        DisplayIndex: number;
        IsLast: boolean;
        IsSpecial: boolean;
        private _dataLoader;
        constructor(masterTable: IMasterTable, dataLoader: Reinforced.Lattice.Services.Partition.BackgroundDataLoader, conf: Reinforced.Lattice.IServerPartitionConfiguration);
        TemplateIdOverride: string;
        DataObject: any;
        Index: number;
        MasterTable: IMasterTable;
        Cells: {
            [index: string]: ICell;
        };
        Show: boolean;
        PagesInput: HTMLInputElement;
        VisualState: Reinforced.Lattice.Rendering.VisualState;
        loadMore(): void;
    }
    class PartitionIndicator implements Reinforced.Lattice.IPartitionRowData {
        constructor(masterTable: IMasterTable, partitionService: Reinforced.Lattice.Services.Partition.BackgroundDataLoader);
        private _masterTable;
        private _dataLoader;
        UiColumnsCount(): number;
        IsLoading(): boolean;
        Stats(): IStatsModel;
        IsClientSearchPending(): boolean;
        CanLoadMore(): boolean;
        LoadAhead(): number;
    }
}
declare module Reinforced.Lattice.Services.Partition {
    class SequentialPartitionService extends ClientPartitionService {
        constructor(masterTable: IMasterTable);
        Owner: ServerPartitionService;
        DataLoader: BackgroundDataLoader;
        private _conf;
        setSkip(skip: number, preserveTake?: boolean): void;
        private _takeDiff;
        setTake(take: number): void;
        isAmountFinite(): boolean;
        amount(): number;
        private resetSkip(take);
        partitionBeforeQuery(serverQuery: IQuery, clientQuery: IQuery, isServerQuery: boolean): boolean;
        partitionAfterQuery(initialSet: any[], query: IQuery, serverCount: number): any[];
        private _provideIndication;
        private _backgroundLoad;
        provide(rows: IRow[]): void;
        hasEnoughDataToSkip(skip: number): boolean;
        isClient(): boolean;
        isServer(): boolean;
    }
}
declare module Reinforced.Lattice.Services.Partition {
    class ServerPartitionService extends ClientPartitionService {
        constructor(masterTable: IMasterTable);
        private _seq;
        private _conf;
        private _serverSkip;
        private _indicator;
        private _dataLoader;
        setSkip(skip: number, preserveTake?: boolean): void;
        protected cut(ordered: any[], skip: number, take: number): any;
        setTake(take: number): void;
        partitionBeforeQuery(serverQuery: IQuery, clientQuery: IQuery, isServerQuery: boolean): boolean;
        private resetSkip(take);
        private switchToSequential();
        switchBack(serverQuery: IQuery, clientQuery: IQuery, isServerQuery: boolean): void;
        private _provideIndication;
        partitionAfterQuery(initialSet: any[], query: IQuery, serverCount: number): any[];
        private _serverTotalCount;
        isAmountFinite(): boolean;
        totalAmount(): number;
        amount(): number;
        isClient(): boolean;
        isServer(): boolean;
        hasEnoughDataToSkip(skip: number): boolean;
    }
}
declare module Reinforced.Lattice.Templating {
    interface IBackbindInfo {
        EventsQueue: IBackbindEvent[];
        MarkQueue: IBackbindMark[];
        DatepickersQueue: IBackbindDatepicker[];
        CallbacksQueue: IBackbindCallback[];
        DestroyCallbacksQueue: IBackbindCallback[];
        CachedVisualStates: {
            [key: string]: IState[];
        };
        HasVisualStates: boolean;
    }
    interface IBackbindMark {
        ElementReceiver: any;
        FieldName: string;
        Key: any;
    }
    interface IBackbindDatepicker {
        ElementReceiver: any;
        IsNullable: boolean;
    }
    interface IBackbindCallback {
        Element?: HTMLElement;
        Callback: any;
        CallbackArguments: any[];
        Target: any;
    }
    interface IBackbindEvent {
        EventReceiver: any;
        Functions: string[];
        Event: Reinforced.Lattice.DOMEvents.IDomEventJson;
        EventArguments: any[];
    }
    interface IState {
        Element: HTMLElement;
        Receiver: any;
        id: string;
        classes: string[];
        attrs: {
            [key: string]: string;
        };
        styles: {
            [key: string]: string;
        };
        content: string;
    }
}
declare module Reinforced.Lattice.Templating {
    class Driver {
        static body(p: Reinforced.Lattice.Templating.TemplateProcess): void;
        static content(p: Reinforced.Lattice.Templating.TemplateProcess, columnName?: string): void;
        static row(p: Reinforced.Lattice.Templating.TemplateProcess, row: IRow): void;
        static line(p: Reinforced.Lattice.Templating.TemplateProcess, ln: ILine): void;
        static headerContent(head: IColumnHeader, p: Reinforced.Lattice.Templating.TemplateProcess): void;
        static rowContent(row: IRow, p: Reinforced.Lattice.Templating.TemplateProcess, columnName?: string): void;
        static cell(p: TemplateProcess, cell: ICell): void;
        static cellContent(c: ICell, p: TemplateProcess): void;
        static plugin(p: TemplateProcess, pluginPosition: string, pluginId: string): void;
        static plugins(p: TemplateProcess, pluginPosition: string): void;
        static renderPlugin(p: TemplateProcess, plugin: IPlugin): void;
        static colHeader(p: Reinforced.Lattice.Templating.TemplateProcess, columnName: string): void;
        static header(p: Reinforced.Lattice.Templating.TemplateProcess, column: IColumn): void;
        static headers(p: TemplateProcess): void;
    }
}
declare module Reinforced.Lattice.Templating {
    class _ltcTpl {
        private static _lib;
        static _(prefix: string, id: string, tpl: ITemplateDel): void;
        static executor(prefix: string, table: Reinforced.Lattice.IMasterTable): TemplatesExecutor;
    }
}
declare module Reinforced.Lattice.Templating {
    class RenderingStack {
        private _contextStack;
        clear(): void;
        Current: IRenderingContext;
        pushContext(ctx: IRenderingContext): void;
        push(elementType: RenderedObject, element: IRenderable): void;
        private getTrack(elementType, element);
        popContext(): void;
    }
    interface IRenderingContext {
        Type: RenderedObject;
        Object?: IRenderable;
        CurrentTrack: string;
        TrackBuffer: string;
        IsTrackWritten: boolean;
    }
}
declare module Reinforced.Lattice.Templating {
    class TemplateProcess {
        constructor(uiColumns: () => IColumn[], executor: Reinforced.Lattice.Templating.TemplatesExecutor);
        private _stack;
        Html: string;
        w: IWriteFn;
        s: IWriteFn;
        Context: IRenderingContext;
        BackInfo: Reinforced.Lattice.Templating.IBackbindInfo;
        Executor: TemplatesExecutor;
        UiColumns: IColumn[];
        ColumnRenderes: {
            [key: string]: (x: ICell) => string;
        };
        private append(str);
        private autotrack(str);
        private static alphaRegex;
        private findStartTag(buf);
        nest(data: any, templateId: string): void;
        private spc(num);
        spaceW(): void;
        nestElement(e: IRenderable, templateId: string, type: RenderedObject): void;
        nestContent(e: IRenderable, templateId: string): void;
        d(model: any, type: RenderedObject): void;
        u(): void;
        vs(stateName: string, state: Reinforced.Lattice.Templating.IState): void;
        e(commaSeparatedFunctions: string, event: Reinforced.Lattice.DOMEvents.IDomEventJson, eventArgs: any[]): void;
        rc(fn: any, args: any[]): void;
        dc(fn: any, args: any[]): void;
        m(fieldName: string, key: string, receiverPath: string): void;
        dp(condition: boolean, nullable: boolean): void;
        private trackAttr();
        isLoc(location: string): boolean;
        isLocation(): boolean;
    }
    enum RenderedObject {
        Plugin = 0,
        Header = 1,
        Row = 2,
        Cell = 3,
        Message = 4,
        Partition = 5,
        Line = 6,
        Custom = 7,
    }
}
declare module Reinforced.Lattice.Templating {
    interface ITemplatesLib {
        Prefix: string;
        Templates: {
            [_: string]: ITemplateDel;
        };
    }
    interface ITemplateDel {
        (data: any, driver: any, w: IWriteFn, p: TemplateProcess, s: IWriteFn): void;
    }
    interface IWriteFn {
        (str: string | number): void;
    }
    interface ITemplateResult {
        Html: string;
        BackbindInfo: IBackbindInfo;
    }
}
