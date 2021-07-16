import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {RecipeService} from "../recipes/recipe.service";
import {Recipe} from "../recipes/recipe.model";
import {map, tap} from "rxjs/operators";
import {AuthService} from "../auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  constructor(private http: HttpClient,
              private recipeService: RecipeService,
              private authService: AuthService) {
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>(
      'https://angular-recipe-c5857-default-rtdb.firebaseio.com/recipes.json')
      .pipe(
        map(rec => {
          return rec.map(recipe => {
            return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []}
          })
        }),
        tap(recipes => {
          this.recipeService.setRecipes(recipes);
        }));

    // return this.authService.user.pipe(
    //   take(1),
    //   exhaustMap(user => {
    //     return this.http.get<Recipe[]>(
    //       'https://angular-recipe-c5857-default-rtdb.firebaseio.com/recipes.json',
    //       {
    //         params: new HttpParams().set('auth', user.token)
    //       }
    //     );
    //   }),
    //   map(rec => {
    //     return rec.map(recipe => {
    //       return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []}
    //     })
    //   }),
    //   tap(recipes => {
    //     this.recipeService.setRecipes(recipes);
    //   }));  // with take operator, dont need to unsubscribe
  }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http.put('https://angular-recipe-c5857-default-rtdb.firebaseio.com/recipes.json', recipes)
      .subscribe(response => {
        console.log(response);
      });
  }
}
