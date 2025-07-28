// Placeholder constants for the generator
export const sourceCodePlaceholder = `@GetMapping("/users")
public ResponseEntity<List<User>> getAllUsers() {
    List<User> users = userService.findAll();
    return ResponseEntity.ok(users);
}

@PostMapping("/users")
public ResponseEntity<User> createUser(@RequestBody User user) {
    User savedUser = userService.save(user);
    return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
}`;

export const projectNamePlaceholder = 'my-awesome-api';
export const apiEndpointPlaceholder = '/api/users';
