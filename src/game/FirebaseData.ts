import {
    CategoryJSON,
    FirebaseDataJSON,
    SubcategoryGroupJSON,
    TimeJSON,
    UserJSON,
} from 'ApiTypes';

export class FirebaseData {
    public users: UserJSON[];
    public times: TimeJSON[];
    public categories: CategoryJSON[];
    public subcategoryGroups: SubcategoryGroupJSON[];

    constructor(firebaseDataJson: FirebaseDataJSON) {
        this.users = firebaseDataJson.users;
        this.times = firebaseDataJson.times;
        this.categories = firebaseDataJson.categories;
        this.subcategoryGroups = firebaseDataJson.subcategoryGroups;
    }
}
