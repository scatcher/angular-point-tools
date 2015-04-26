
declare module ap {

    export interface IIndexedCache <T>{
        addEntity(entity: T): void;
        clear(): void;
        count(): number;
        first(): T;
        keys(): string[];
        last(): T;
        nthEntity(index: number): T;
        removeEntity(listItem: T|number): void;
        toArray(): T[];
        //Object with keys equaling ID and values being the individual list item
        [key: number]: T;
    }

    export interface IListItemCrudOptions {
        //TODO Implement
    }

    export interface IFieldDefinition {
        choices?: string[];
        Choices?: string[];
        description?: string;
        Description?: string;
        displayName?: string;
        DisplayName?: string;
        getDefaultValueForType?(): string;
        getDefinition?(): string;
        getMockData?(options?: Object): any;
        label: string;
        mappedName: string;
        objectType: string;
        readOnly?: boolean;
        required?: boolean;
        Required?: boolean;
        staticName: string;
        List?
    }

    export interface IListItemVersion extends IListItem {
        version: Date;
    }

    export interface IWorkflowDefinition {
        name: string;
        instantiationUrl: string;
        templateId: string;
    }

    export interface IStartWorkflowParams {
        templateId?: string;
        workflowName?: string;
        fileRef?: string;
    }

    export interface ILookup {
        lookupValue: string;
        lookupId: number;
    }

    export interface IUser {
        lookupValue: string;
        lookupId: number;
    }


    export interface IList {
        customFields: IFieldDefinition[];
        effectivePermMask?: string;
        fields: IFieldDefinition[];
        getListId(): string;
        guid: string;
        identifyWebURL(): string;
        isReady: boolean;
        title: string;
        viewFields: string;
        webURL: string;
    }


    export interface IDiscussionThread {
        posts: IDiscussionThreadPost[];
        nextId: number;
        getNextId(): number;
        createPost(parentId: number, content: string): IDiscussionThreadPost;
        getListItem(): IListItem;
        prune(): void;
        saveChanges(): ng.IPromise<IListItem>;
    }

    export interface IDiscussionThreadPost {
        content: string;
        id: number;
        parentId: number;
        created: Date;
        user: IUser;
        removePost(): void;
        deletePost(): ng.IPromise<IListItem>;
        savePost(): ng.IPromise<IListItem>;
        reply(): ng.IPromise<IListItem>;
    }

    export interface ICache extends IIndexedCache{
        //TODO Populate me!
    }

    export interface IQuery {
        cacheXML?: boolean;
        changeToken?:string;
        execute?<T>(options?: Object): ng.IPromise< IIndexedCache<T> >;
        initialized:ng.IDeferred<any>
        lastRun?: Date;
        offlineXML?: string;
        operation?: string;
        query?: string;
        queryOptions?: string;
    }

    export interface IQueryOptions {
        name?: string;
        operation?: string;
    }

    export interface IUserPermissionsObject {
        ViewListItems: boolean;
        AddListItems: boolean;
        EditListItems: boolean;
        DeleteListItems: boolean;
        ApproveItems: boolean;
        OpenItems: boolean;
        ViewVersions: boolean;
        DeleteVersions: boolean;
        CancelCheckout: boolean;
        PersonalViews: boolean;
        ManageLists: boolean;
        ViewFormPages: boolean;
        Open: boolean;
        ViewPages: boolean;
        AddAndCustomizePages: boolean;
        ApplyThemeAndBorder: boolean;
        ApplyStyleSheets: boolean;
        ViewUsageData: boolean;
        CreateSSCSite: boolean;
        ManageSubwebs: boolean;
        CreateGroups: boolean;
        ManagePermissions: boolean;
        BrowseDirectories: boolean;
        BrowseUserInfo: boolean;
        AddDelPrivateWebParts: boolean;
        UpdatePersonalWebParts: boolean;
        ManageWeb: boolean;
        UseRemoteAPIs: boolean;
        ManageAlerts: boolean;
        CreateAlerts: boolean;
        EditMyUserInfo: boolean;
        EnumeratePermissions: boolean;
        FullMask: boolean;
    }

    export interface IAPConfig{
        appTitle: string;
        debug: boolean;
        defaultQueryName: string;
        defaultUrl: string;
        environment?: string;
        firebaseURL?: string;
        offline: boolean;
    }

}

interface JQuery {
    SPFilterNode(string);
}