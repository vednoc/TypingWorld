package typingworld.services;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import typingworld.database.Database;
import typingworld.model.User;

import java.util.List;

public interface UserService {


    public static List<User> getUsers(){
        return Database.getDatabase().getUsers();
    }

    public static boolean register(@NotNull final String username,
                                   @NotNull final String password) {
        // update the database with these values?
        return Database.getDatabase().register(username, password);
    }



}
