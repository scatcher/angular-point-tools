
declare module ap {

    interface IIndexedCache {
        addEntity(entity:ListItem): void;
        clear(): void;
        count(): number;
        first(): ListItem;
        keys(): string[];
        last(): ListItem;
        nthEntity(index:number): ListItem;
        removeEntity(entity:ListItem): void;
        toArray(): ListItem[];
        //Object with keys equaling ID and values being the individual list item
        [key: number]: ListItem;
    }

    interface IListItemCrudOptions {
        //TODO Implement
    }

    interface IFieldDefinition {
        choices?:string[];
        Choices?:string[];
        description?:string;
        Description?:string;
        displayName?:string;
        DisplayName?:string;
        getDefaultValueForType?():string;
        getDefinition?():string;
        getMockData?(options?:Object):any;
        label:string;
        mappedName:string;
        objectType:string;
        readOnly?:boolean;
        required?:boolean;
        Required?:boolean;
        staticName:string;
        List?
    }

    interface IListItemVersion {
        //TODO Implement
    }

    interface IWorkflowDefinition {
        name:string;
        instantiationUrl:string;
        templateId:string;
    }

    interface IStartWorkflowParams {
        templateId?:string;
        workflowName?:string;
        fileRef?:string;
    }

    interface ILookup {
        lookupValue:string;
        lookupId:number;
    }

    interface IUser {
        lookupValue:string;
        lookupId:number;
    }

    interface IListItem {
        id?:number;
        created?:Date;
        modified?:Date;
        author?: IUser;
        editor?: IUser;
        permMask?:string;
        uniqueId?:string;
        fileRef?: ILookup;

        deleteAttachment(url:string): ng.IPromise<any>;
        deleteItem(options?:IListItemCrudOptions): ng.IPromise<any>;
        getAttachmentCollection(): ng.IPromise<string[]>;
        getAvailableWorkflows(): ng.IPromise<IWorkflowDefinition[]>;
        getFieldChoices(fieldName:string): string[];
        getFieldDefinition(fieldName:string): IFieldDefinition;
        getFieldDescription(fieldName:string): string;
        getFieldLabel(fieldName:string): string;
        getFieldVersionHistory(fieldNames:string[]): ng.IPromise<IListItemVersion>;
        getFormattedValue(fieldName:string, options:Object): string;
        getLookupReference(fieldName:string, lookupId:number): ListItem;
        resolvePermissions(): IUserPermissionsObject;
        saveChanges(options?:IListItemCrudOptions): ng.IPromise<ListItem>;
        saveFields(fieldArray:string[], options?:IListItemCrudOptions): ng.IPromise<ListItem>;
        startWorkflow(options:IStartWorkflowParams): ng.IPromise<any>;
        validateEntity(options?:Object): boolean;

        //Added by Model Instantiation
        getModel(): IModel;
        getListId():string;
        getList?(): IList;

    }

    interface IList {
        customFields:IFieldDefinition[];
        effectivePermMask?:string;
        fields:IFieldDefinition[];
        getListId():string;
        guid:string;
        identifyWebURL():string;
        isReady:boolean;
        title:string;
        viewFields:string;
        webURL:string;
    }

    interface IModel {
        factory:ObjectConstructor;
        list:IList;

        addNewItem(entity:ListItem, options?:Object): ng.IPromise<ListItem>;
        createEmptyItem(overrides?:Object): ListItem;
        executeQuery(queryName?:string, options?:Object): ng.IPromise<IIndexedCache>;
        extendListMetadata(options:Object): ng.IPromise<any>;
        generateMockData(options?:Object): ListItem[];
        getAllListItems(): ng.IPromise<IIndexedCache>;
        getCache(queryName:string): ICache;
        getCachedEntities(): IIndexedCache;
        getCachedEntity(entityId:number): ListItem;
        getFieldDefinition(fieldName:string): IFieldDefinition;
        getList():IList;
        getListId():string;
        getListItemById(entityId:number, options?:Object): ng.IPromise<ListItem>;
        getModel():Model;
        getQuery(queryName:string): IQuery;
        isInitialised(): boolean;
        registerQuery(queryOptions: IQueryOptions): IQuery;
        resolvePermissions(): IUserPermissionsObject;
        validateEntity(entity:ListItem, options?:Object): boolean;
    }

    interface IDiscussionThread {
        posts:IDiscussionThreadPost[];
        nextId:number;
        getNextId():number;
        createPost(parentId:number, content:string):IDiscussionThreadPost;
        getListItem():ListItem;
        prune():void;
        saveChanges():ng.IPromise<ListItem>;
    }

    interface IDiscussionThreadPost {
        content:string;
        id:number;
        parentId:number;
        created:Date;
        user:IUser;
        removePost():void;
        deletePost():ng.IPromise<ListItem>;
        savePost():ng.IPromise<ListItem>;
        reply():ng.IPromise<ListItem>;
    }

    interface ICache {
        //TODO Populate me!
    }

    interface IQuery {
        execute?(options?:Object):ng.IPromise<IIndexedCache>;
        operation?:string;
        cacheXML?:boolean;
        offlineXML?:string;
        query?:string;
        queryOptions?:string;
    }

    interface IQueryOptions {
        name?:string;
        operation?:string;
    }

    interface IUserPermissionsObject {
        ViewListItems:boolean;
        AddListItems:boolean;
        EditListItems:boolean;
        DeleteListItems:boolean;
        ApproveItems:boolean;
        OpenItems:boolean;
        ViewVersions:boolean;
        DeleteVersions:boolean;
        CancelCheckout:boolean;
        PersonalViews:boolean;
        ManageLists:boolean;
        ViewFormPages:boolean;
        Open:boolean;
        ViewPages:boolean;
        AddAndCustomizePages:boolean;
        ApplyThemeAndBorder:boolean;
        ApplyStyleSheets:boolean;
        ViewUsageData:boolean;
        CreateSSCSite:boolean;
        ManageSubwebs:boolean;
        CreateGroups:boolean;
        ManagePermissions:boolean;
        BrowseDirectories:boolean;
        BrowseUserInfo:boolean;
        AddDelPrivateWebParts:boolean;
        UpdatePersonalWebParts:boolean;
        ManageWeb:boolean;
        UseRemoteAPIs:boolean;
        ManageAlerts:boolean;
        CreateAlerts:boolean;
        EditMyUserInfo:boolean;
        EnumeratePermissions:boolean;
        FullMask:boolean;
    }

}
