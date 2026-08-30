class Department {
  final int id;
  final String name;

  Department({required this.id, required this.name});

  @override
  String toString() => 'Department(id: $id, name: $name)';

  factory Department.fromJson(Map<String, dynamic> json) =>
      Department(id: json['id'] as int, name: json['name'] as String);

  Map<String, dynamic> toJson() => {'id': id, 'name': name};
}
